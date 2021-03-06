const moment = require('moment')

const state = require('../state.js')
const profiles = require('../profiles.js')
const utils = require('../utils.js')

const debug = require('@ff0000-ad-tech/debug')
var log = debug('wp-creative-server:rpc:profiles')
// SILENCE
debug.disable('wp-creative-server:rpc:profiles')

// get current profiles
function getProfiles(cb, err) {
	log('getProfiles()')
	const out = profiles.getProfiles()
	if (out instanceof Error) {
		return err(out)
	}
	log(out)
	cb(out)
}

// create new profile
function newProfile(name, cb, err) {
	log('newProfile()', name)
	const result = profiles.addProfile(name)
	if (result instanceof Error) {
		return err(result)
	}
	cb(result)
}

// update profile
function updateProfile(name, profile, cb, err) {
	log('updateProfile()', name)
	log(profile)
	const result = profiles.updateProfile(name, profile)
	if (result instanceof Error) {
		return err(result)
	}
	cb(result)
}

// delete profile
function deleteProfile(name, cb, err) {
	log('deleteProfile()', name)
	const result = profiles.deleteProfile(name)
	if (result instanceof Error) {
		return err(result)
	}
	cb(result)
}

// add deploy target to profile
function addDeployTargets(name, target, cb, err) {
	log('addDeployTargets()', name)
	const result = profiles.addDeployTargets(name, target)
	if (result instanceof Error) {
		return err(result)
	}
	cb(result)
}

// remove deploy target from profile
function removeDeployTargets(name, target, cb, err) {
	log('removeDeployTargets()', name)
	const result = profiles.removeDeployTargets(name, target)
	if (result instanceof Error) {
		return err(result)
	}
	cb(result)
}

module.exports = {
	getProfiles,
	newProfile,
	updateProfile,
	deleteProfile,
	addDeployTargets,
	removeDeployTargets
}
