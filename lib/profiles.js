const fs = require('fs')
const path = require('path')

const watching = require('./compiling/watching.js')
const utils = require('./utils.js')

const debug = require('@ff0000-ad-tech/debug')
var log = debug('wp-creative-server:lib:profiles')
const mLog = (...args) => {
	log(...args)
}

const PROFILE_DEBUG = 'debug'
const PROFILES_PATH = `${global.servePath}/${utils.BUILD_FOLDER}/profiles.json`

const defaultProfile = 'default'
function getProfileStruct(profile) {
	return {
		webpack: {
			deploy: {
				profile: {
					name: profile,
					fbaCompile: true,
					optimize: true,
					env: {
						runPath: '',
						adPath: ''
					}
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
let profilesJsonCached
let cacheRefreshAt = 0 // time
const cacheExpire = 2000 // milliseconds

function updateCache(profilesJson) {
	profilesJsonCached = profilesJson
	cacheRefreshAt = Date.now()
	return profilesJsonCached
}

function load() {
	// check to return cached
	if (Date.now() < cacheRefreshAt + cacheExpire) {
		return profilesJsonCached
	}
	// load fresh
	let profilesJson
	if (fs.existsSync(PROFILES_PATH)) {
		try {
			profilesJson = require(PROFILES_PATH)
		} catch (err) {
			return new Error('Unable to parse build/profiles.json')
		}
	}
	if (!profilesJson || !Object.keys(profilesJson).length) {
		profilesJson = {}
		profilesJson[defaultProfile] = getProfileStruct(defaultProfile)
	}
	return updateCache(profilesJson)
}
function save(profilesJson) {
	try {
		fs.writeFileSync(PROFILES_PATH, JSON.stringify(profilesJson, null, 2))
		return updateCache(profilesJson)
	} catch (err) {
		mLog('Unable to save build/profiles.json', err)
	}
}

/** -- Profile Management ----
 *
 *
 */
// get all profiles
function getProfiles() {
	const profilesJson = load()
	return profilesJson
}

// update profile
function updateProfile(name, profile) {
	let profilesJson = load()
	profilesJson[name] = profile
	profilesJson[name].updateAt = Date.now()
	save(profilesJson)
	return profilesJson
}

// add profile
function addProfile(name) {
	let profilesJson = load()
	if (name in profilesJson) {
		return profilesJson
	}
	profilesJson[name] = getProfileStruct(name)
	save(profilesJson)
	return profilesJson
}

// delete profile
function deleteProfile(name) {
	let profilesJson = load()
	delete profilesJson[name]
	save(profilesJson)
	return profilesJson
}

/** -- Deploy Targets ----
 *
 *
 */
// add deploy target
function addDeployTargets(name, targets) {
	targets = Array.isArray(targets) ? targets : [targets]
	let profilesJson = load()
	mLog('addDeployTargets()')
	targets.forEach((target) => {
		if (getProfileTargetIndex(profilesJson[name], target) === -1) {
			profilesJson[name].targets.push({
				size: target.size,
				index: target.index,
				deployAt: null
			})
		}
	})
	save(profilesJson)
}
function removeDeployTargets(name, targets) {
	targets = Array.isArray(targets) ? targets : [targets]
	let profilesJson = load()
	targets.forEach((target) => {
		const i = getProfileTargetIndex(profilesJson[name], target)
		if (i !== -1) {
			profilesJson[name].targets.splice(i, 1)
		}
	})
	save(profilesJson)
}
function getProfileTargetIndex(profile, target) {
	// mLog('getProfileTargetIndex()', 'profile.targets.length', profile.targets.length)
	for (var i = 0; i < profile.targets.length; i++) {
		// mLog('getProfileTargetIndex()', `profile.targets[${i}].size`, profile.targets[i].size, `target.size`, target.size, `profile.targets[${i}].index`, profile.targets[i].index, `target.index`, target.index)
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
	// mLog('markDeployInProgress()', profileName, `${target.size}/${target.index}`)
	let profilesJson = load()
	const i = getProfileTargetIndex(profilesJson[profileName], target)
	// mLog('markDeployInProgress()', `i`, i)
	profilesJson[profileName].targets[i].deployAt = '...'
	// mLog('markDeployInProgress()', `profilesJson[${profileName}].targets[${i}].deployAt`, profilesJson[profileName].targets[i].deployAt)
	save(profilesJson)
}
// mark time a profile's target is deployed
function markDeployed(profileName, target) {
	if (profileName === PROFILE_DEBUG) {
		return
	}
	mLog('markDeployed()', profileName, `${target.size}/${target.index}`)
	let profilesJson = load()
	const i = getProfileTargetIndex(profilesJson[profileName], target)
	profilesJson[profileName].targets[i].deployAt = Date.now()
	save(profilesJson)
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
