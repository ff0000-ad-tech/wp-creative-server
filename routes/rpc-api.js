const dnode = require('dnode')
const shoe = require('shoe')

const creativeRpc = require('../lib/rpc/creative.js')
const targetsRpc = require('../lib/rpc/targets.js')
const profilesRpc = require('../lib/rpc/profiles.js')
const compilingRpc = require('../lib/rpc/compiling.js')

const debug = require('debug')
var log = debug('wp-creative-server:rpc-api')

// API METHODS EXPOSED via RPC
const api = {
	getCreative: creativeRpc.getCreative,

	getTargets: targetsRpc.getTargets,
	refreshTargets: targetsRpc.refreshTargets,

	getProfiles: profilesRpc.getProfiles,
	newProfile: profilesRpc.newProfile,
	updateProfile: profilesRpc.updateProfile,
	deleteProfile: profilesRpc.deleteProfile,
	addDeployTargets: profilesRpc.addDeployTargets,
	removeDeployTargets: profilesRpc.removeDeployTargets,

	getWpCmd: compilingRpc.getWpCmd
}

// connect dnode
function connect(options) {
	log('Connecting Public API:')
	log(api)
	// on request
	var sock = shoe(function(stream) {
		var d = dnode(api)
		d.pipe(stream).pipe(d)
	})
	return sock
}

// NOTE: RPC methods need to be exposed on the API, not as exports to the backend
module.exports = {
	connect
}
