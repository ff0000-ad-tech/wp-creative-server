const dnode = require('dnode')
const shoe = require('shoe')

const pluginsBackend = require('../lib/managers/plugins.js')
const creativeBackend = require('../lib/managers/creative.js')
const targetsBackend = require('../lib/managers/targets.js')
const profilesBackend = require('../lib/managers/profiles.js')
const compilingBackend = require('../lib/managers/compiling.js')
const miscBackend = require('../lib/managers/misc.js')

const debug = require('@ff0000-ad-tech/debug')
var log = debug('wp-creative-server:backend-api')

// API METHODS EXPOSED via Backend
const api = {
	getAppMeta: miscBackend.getAppMeta,

	getPlugins: pluginsBackend.getPlugins,
	copyPluginInstallCmd: pluginsBackend.copyPluginInstallCmd,

	getCreative: creativeBackend.getCreative,

	readTargets: targetsBackend.readTargets,
	refreshTargets: targetsBackend.refreshTargets,

	getProfiles: profilesBackend.getProfiles,
	newProfile: profilesBackend.newProfile,
	updateProfile: profilesBackend.updateProfile,
	deleteProfile: profilesBackend.deleteProfile,
	addDeployTargets: profilesBackend.addDeployTargets,
	removeDeployTargets: profilesBackend.removeDeployTargets,

	copyWpCmd: compilingBackend.copyWpCmd,
	copyToClipboard: miscBackend.copyToClipboard
}

// connect dnode
function connect(options) {
	log('Connecting Backend-API')
	// log(api)
	// on request
	var sock = shoe(function(stream) {
		var d = dnode(api)
		d.pipe(stream).pipe(d)
	})
	return sock
}

// NOTE: Backend methods need to be exposed on the API, not as exports to the backend
module.exports = {
	connect,
	api
}
