const state = require('../state.js')
const profiles = require('../profiles.js')
const targets = require('../targets.js')
const watching = require('../compiling/watching.js')
const clipboardy = require('clipboardy')

const debug = require('debug')
var log = debug('wp-creative-server:rpc:compiling')

// on user request
function copyWpCmd(type, size, index, cb, err) {
	if (type !== profiles.PROFILE_DEBUG && !(type in profiles.getProfiles())) {
		return err(new Error('Profile name not found'))
	}
	if (!state.getTargets(targets.generateId(size, index))) {
		return err(new Error(`Unable to find a target for ${size}/${index}`))
	}
	const cmd = watching.getWpCmd(type, size, index)
	clipboardy.writeSync(cmd.shell)
	cb()
}

// tried to put this in utils but got compile headeaches with clipboardy...works in this scope, so...blech
function copyToClipboard(str, cb, err) {
	clipboardy.writeSync(str)
	cb()
}

module.exports = {
	copyWpCmd
}
