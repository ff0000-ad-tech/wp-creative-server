const moment = require('moment')

const state = require('../state.js')
const profiles = require('../profiles.js')
const utils = require('../utils.js')

const debug = require('debug')
var log = debug('wp-creative-server:rpc:profiles')
// SILENCE
debug.disable('wp-creative-server:rpc:profiles')

// get current profiles
function getProfiles(cb, err) {
	log('getProfiles()')
	const result = profiles.getProfiles()
	if (result instanceof Error) {
		return err(result)
	}
	// format result
	var out = {}
	for (var id in result) {
		out[id] = {
			targets: result[id].targets.map(target => {
				return utils.format(
					target,
					{
						deployAt: value => {
							return value ? moment(value).from(Date.now()) : null
						}
					},
					false
				)
			})
		}
	}
	log(out)
	cb(out)
}

// get current profile
function getCurrentProfile(cb, err) {
	const result = profiles.getCurrentProfile()
	if (result instanceof Error) {
		return err(result)
	}
	cb(result)
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
	getCurrentProfile,
	newProfile,
	updateProfile,
	deleteProfile,
	addDeployTargets,
	removeDeployTargets
}
