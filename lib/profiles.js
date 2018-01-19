const fs = require('fs')
const path = require('path')
const state = require('./state.js')

const debug = require('debug')
var log = debug('wp-creative-server:lib:profiles')

const buildPackagePath = `${global.servePath}/build/package.json`

// package.json IO
function load() {
	if (fs.existsSync(buildPackagePath)) {
		try {
			const packageJson = require(buildPackagePath)
			if (!('profiles' in packageJson)) {
				packageJson.profiles = {}
			}
			return packageJson
		} catch (err) {
			return new Error('Unable to parse build/package.json')
		}
	}
	return new Error('Unable to locate build/package.json')
}
function save(packageJson) {
	if (fs.existsSync(buildPackagePath)) {
		return fs.writeFileSync(buildPackagePath, JSON.stringify(packageJson, null, 2))
	}
	return new Error('Unable to locate build/package.json')
}

// get all profiles
function getProfiles() {
	const packageJson = load()
	return 'profiles' in packageJson ? packageJson.profiles : {}
}

// add profile
function addProfile(name) {
	let packageJson = load()
	if (name in packageJson.profiles) {
		return
	}
	// each profile has a list of sources, see webpack.config.js
	packageJson.profiles[name] = {
		environment: {},
		targets: [],
		updateAt: Date.now()
	}
	save(packageJson)
}

// update profile
function updateProfile(name, profile) {
	let packageJson = load()
	packageJson.profiles[name] = profile
	packageJson.profiles[name].updateAt = Date.now()
	save(packageJson)
}

// delete profile
function deleteProfile(name) {
	let packageJson = load()
	delete packageJson.profiles[name]
	save(packageJson)
}

// add deploy target
function addDeployTarget(name, target) {
	let packageJson = load()
	if (getProfileTargetIndex(packageJson.profiles[name], target) === -1) {
		packageJson.profiles[name].targets.push({
			size: target.size,
			index: target.index,
			deployAt: null
		})
		save(packageJson)
	}
}
function removeDeployTarget(name, target) {
	let packageJson = load()
	const i = getProfileTargetIndex(packageJson.profiles[name], target)
	if (i !== -1) {
		packageJson.profiles[name].targets.splice(i, 1)
		save(packageJson)
	}
}
function getProfileTargetIndex(profile, target) {
	for (var i = 0; i < profile.targets.length; i++) {
		if (profile.targets[i].size === target.size && profile.targets[i].index === target.index) {
			return i
		}
	}
	return -1
}

module.exports = {
	getProfiles,
	addProfile,
	updateProfile,
	deleteProfile,
	addDeployTarget,
	removeDeployTarget
}
