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
			return require(buildPackagePath)
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
	if (!('profiles' in packageJson)) {
		packageJson.profiles = {}
	}
	if (name in packageJson.profiles) {
		return
	}
	// each profile has a list of sources, see webpack.config.js
	packageJson.profiles[name] = {
		environment: {},
		sources: [],
		updated: Date.now()
	}
	save(packageJson)
}

// update profile
function updateProfile(name, profile) {
	let packageJson = load()
	if (!('profiles' in packageJson)) {
		packageJson.profiles = {}
	}
	packageJson.profiles[name] = profile
	packageJson.profiles[name].updated = Date.now()
	save(packageJson)
}

// delete profile
function deleteProfile(name) {
	let packageJson = load()
	if (!('profiles' in packageJson)) {
		packageJson.profiles = {}
	}
	delete packageJson.profiles[name]
	save(packageJson)
}

module.exports = {
	getProfiles,
	addProfile,
	updateProfile,
	deleteProfile
}
