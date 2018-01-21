const dnode = require('dnode')
const shoe = require('shoe')
const moment = require('moment')

const targets = require('../lib/targets.js')
const profiles = require('../lib/profiles.js')

const debug = require('debug')
var log = debug('wp-creative-server:rpc-api')
var log1 = debug('wp-creative-server:rpc-api:targets')
// SILENCE
debug.disable('wp-creative-server:rpc-api:targets')

const api = {
	getCreative,
	getTargets,
	getProfiles,
	newProfile,
	updateProfile,
	deleteProfile,
	addDeployTarget,
	removeDeployTarget
}

// connect dnode
function connect(options) {
	state = options.state

	log('Connecting Public API:')
	log(api)
	// on request
	var sock = shoe(function(stream) {
		var d = dnode(api)
		d.pipe(stream).pipe(d)
	})
	return sock
}

var state

/* -- REMOTE CONTROL METHODS ----------------------------------------------
 *
 *
 *
 */
// get current creative
function getCreative(cb, err) {
	log('getCreative()')
	var out = {
		name: targets.getCreativeName()
	}
	cb(out)
}

// get compile/deploy targets
function getTargets(cb, err) {
	log1('getTargets()')

	// refresh targets and update state
	targets
		.readTargets()
		.then(targets => {
			var out = {}
			for (var id in targets) {
				out[id] = state.format(targets[id], {
					size: value => {
						return value
					},
					index: value => {
						return value
					},
					debug: value => {
						return {
							watching: value.watching,
							processing: value.processing,
							error: value.error,
							updateAt: moment(value.updateAt).from(Date.now()),
							cmd: {
								shell: value.cmd.shell,
								out: value.cmd.out
							}
						}
					},
					traffic: value => {
						return {
							watching: value.watching,
							processing: value.processing,
							error: value.error,
							updateAt: moment(value.updateAt).from(Date.now()),
							cmd: {
								shell: value.cmd.shell,
								out: value.cmd.out
							}
						}
					}
				})
			}
			log1(out)
			cb(out)
		})
		.catch(error => {
			err(error)
		})
}

// get current profiles
function getProfiles(cb, err) {
	log('getProfiles()')
	const result = profiles.getProfiles()
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

// add deploy target
function addDeployTarget(name, target, cb, err) {
	log('addDeployTarget()', name)
	const result = profiles.addDeployTarget(name, target)
	if (result instanceof Error) {
		return err(result)
	}
	cb(result)
}

// remove deploy target
function removeDeployTarget(name, target, cb, err) {
	log('removeDeployTarget()', name)
	const result = profiles.removeDeployTarget(name, target)
	if (result instanceof Error) {
		return err(result)
	}
	cb(result)
}

// NOTE: RPC methods need to be exposed on the API, not as exports to the backend
module.exports = {
	connect
}
