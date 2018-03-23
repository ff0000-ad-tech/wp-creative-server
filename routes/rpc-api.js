const dnode = require('dnode')
const shoe = require('shoe')

const pluginsRpc = require('../lib/rpc/plugins.js')
const creativeRpc = require('../lib/rpc/creative.js')
const targetsRpc = require('../lib/rpc/targets.js')
const profilesRpc = require('../lib/rpc/profiles.js')
const compilingRpc = require('../lib/rpc/compiling.js')
const miscRpc = require('../lib/rpc/misc.js')

const debug = require('debug')
var log = debug('wp-creative-server:rpc-api')

// API METHODS EXPOSED via RPC
const api = {
	getAppMeta: miscRpc.getAppMeta,

	getPlugins: pluginsRpc.getPlugins,
	copyToClipboard: miscRpc.copyToClipboard,

	getCreative: creativeRpc.getCreative,

	readTargets: targetsRpc.readTargets,
	refreshTargets: targetsRpc.refreshTargets,

	getProfiles: profilesRpc.getProfiles,
	newProfile: profilesRpc.newProfile,
	updateProfile: profilesRpc.updateProfile,
	deleteProfile: profilesRpc.deleteProfile,
	addDeployTargets: profilesRpc.addDeployTargets,
	removeDeployTargets: profilesRpc.removeDeployTargets,

	copyWpCmd: compilingRpc.copyWpCmd
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
