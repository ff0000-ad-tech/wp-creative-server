const fs = require('fs')
const path = require('path')

const watching = require('./compiling/watching.js')
const utils = require('./utils.js')

const debug = require('debug')
var log = debug('wp-creative-server:lib:profiles')

const PROFILE_DEBUG = 'debug'
const BUILD_PACKAGE_PATH = `${global.servePath}/${utils.BUILD_FOLDER}/package.json`

const defaultProfile = 'default'
function getProfileStruct(profile) {
	return {
		webpack: {
			deploy: {
				profile: {
					name: profile,
					adEnvironment: {
						id: profile,
						runPath: '',
						adPath: ''
					}
				},
				output: {
					context: './[output.folder]/[profile.name]/[source.size]_[source.index]/'
				}
			}
		},
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
	if (fs.existsSync(BUILD_PACKAGE_PATH)) {
		try {
			const packageJson = require(BUILD_PACKAGE_PATH)
			if (!('profiles' in packageJson) || !Object.keys(packageJson.profiles).length) {
				packageJson.profiles = {}
				packageJson.profiles[defaultProfile] = getProfileStruct(defaultProfile)
			}
			return updateCache(packageJson)
		} catch (err) {
			return new Error('Unable to parse build/package.json')
		}
	}
	return new Error('Unable to locate build/package.json')
}
function save(packageJson) {
	if (fs.existsSync(BUILD_PACKAGE_PATH)) {
		fs.writeFileSync(BUILD_PACKAGE_PATH, JSON.stringify(packageJson, null, 2))
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
	packageJson.profiles[name] = getProfileStruct(name)
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

/** -- Background Management ----
 *
 *
 */
// mark a profile target is being deployed
function markDeployInProgress(profileName, target) {
	if (profileName === PROFILE_DEBUG) {
		return
	}
	log('markDeployInProgress()', profileName, `${target.size}/${target.index}`)
	let packageJson = load()
	const i = getProfileTargetIndex(packageJson.profiles[profileName], target)
	packageJson.profiles[profileName].targets[i].deployAt = '...'
	save(packageJson)
}
// mark time a profile's target is deployed
function markDeployed(profileName, target) {
	if (profileName === PROFILE_DEBUG) {
		return
	}
	log('markDeployed()', profileName, `${target.size}/${target.index}`)
	let packageJson = load()
	const i = getProfileTargetIndex(packageJson.profiles[profileName], target)
	packageJson.profiles[profileName].targets[i].deployAt = Date.now()
	save(packageJson)
}

module.exports = {
	PROFILE_DEBUG,
	getProfiles,
	addProfile,
	updateProfile,
	deleteProfile,
	addDeployTargets,
	removeDeployTargets,
	markDeployInProgress,
	markDeployed
}
