const fs = require('fs')
const path = require('path')
const moment = require('moment')

const debug = require('debug')
var log = debug('wp-creative-server:lib:profiles')

const buildPackagePath = `${global.servePath}/build/package.json`

const defaultProfile = 'default'
function getDefaultProfile() {
	return {
		environment: {},
		targets: [],
		updateAt: Date.now()
	}
}

/** -- package.json IO ----
 *
 *
 */
let packageJsonCached
let cacheRefreshAt = 0 // time
const cacheExpire = 2000 // milliseconds

function updateCache(packageJson) {
	packageJsonCached = packageJson
	cacheRefreshAt = Date.now()
	return packageJsonCached
}

function load() {
	// check to return cached
	if (Date.now() < cacheRefreshAt + cacheExpire) {
		return packageJsonCached
	}
	// load fresh
	if (fs.existsSync(buildPackagePath)) {
		try {
			const packageJson = require(buildPackagePath)
			if (!('profiles' in packageJson)) {
				packageJson.profiles = {}
				packageJson.profiles[defaultProfile] = getDefaultProfile()
			}
			return updateCache(packageJson)
		} catch (err) {
			return new Error('Unable to parse build/package.json')
		}
	}
	return new Error('Unable to locate build/package.json')
}
function save(packageJson) {
	if (fs.existsSync(buildPackagePath)) {
		fs.writeFileSync(buildPackagePath, JSON.stringify(packageJson, null, 2))
		return updateCache(packageJson)
	}
	return new Error('Unable to locate build/package.json')
}

/** -- Profile Management ----
 *
 *
 */
// get all profiles
function getProfiles() {
	const packageJson = load()
	return packageJson.profiles
}

// update profile
function updateProfile(name, profile) {
	let packageJson = load()
	packageJson.profiles[name] = profile
	packageJson.profiles[name].updateAt = Date.now()
	save(packageJson)
}

// add profile
function addProfile(name) {
	let packageJson = load()
	if (name in packageJson.profiles) {
		return
	}
	packageJson.profiles[name] = getDefaultProfile()
	save(packageJson)
}

// delete profile
function deleteProfile(name) {
	let packageJson = load()
	delete packageJson.profiles[name]
	save(packageJson)
}

/** -- Deploy Targets ----
 *
 *
 */
// add deploy target
function addDeployTargets(name, targets) {
	targets = Array.isArray(targets) ? targets : [targets]
	let packageJson = load()
	targets.forEach(target => {
		if (getProfileTargetIndex(packageJson.profiles[name], target) === -1) {
			packageJson.profiles[name].targets.push({
				size: target.size,
				index: target.index,
				deployAt: null
			})
		}
	})
	save(packageJson)
}
function removeDeployTargets(name, targets) {
	targets = Array.isArray(targets) ? targets : [targets]
	let packageJson = load()
	targets.forEach(target => {
		const i = getProfileTargetIndex(packageJson.profiles[name], target)
		if (i !== -1) {
			packageJson.profiles[name].targets.splice(i, 1)
		}
	})
	save(packageJson)
}
function getProfileTargetIndex(profile, target) {
	for (var i = 0; i < profile.targets.length; i++) {
		if (profile.targets[i].size === target.size && profile.targets[i].index === target.index) {
			return i
		}
	}
	return -1
}
function markDeployed(name, targets) {
	log('markDeployed()', name, targets)
	targets = Array.isArray(targets) ? targets : [targets]
	let packageJson = load()
	targets.forEach(target => {
		const i = getProfileTargetIndex(packageJson.profiles[name], target)
		packageJson.profiles[name].targets[i].deployAt = Date.now()
	})
	save(packageJson)
}

module.exports = {
	getProfiles,
	addProfile,
	updateProfile,
	deleteProfile,
	addDeployTargets,
	removeDeployTargets,
	markDeployed
}
