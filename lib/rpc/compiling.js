const state = require('../state.js')
const watching = require('../compiling/watching.js')
const wpDebug = require('../compiling/wp-debug.js')
const wpTraffic = require('../compiling/wp-traffic.js')

const debug = require('debug')
var log = debug('wp-creative-server:rpc:compiling')
// SILENCE
debug.disable('wp-creative-server:rpc:compiling')

// on user request
function getWpCmd(profileName, size, index, type, cb, err) {
	if (!(profileName in getProfiles())) {
		return err(new Error('Profile name not found'))
	}
	if (!state.getTargets(targets.generateId(size, index))) {
		return err(new Error(`Unable to find a target for ${size}/${index}`))
	}
	const params = {
		profileName,
		size,
		index
	}
	if (type == watching.TYPE_DEBUG) {
		cb(wpDebug.prepareCmd(params))
	} else {
		cb(wpTraffic.prepareCmd(params))
	}
}
