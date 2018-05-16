const state = require('../state.js')
const profiles = require('../profiles.js')
const targets = require('../targets.js')
const watching = require('../compiling/watching.js')
const clipboardy = require('clipboardy')

const debug = require('@ff0000-ad-tech/debug')
var log = debug('wp-creative-server:rpc:compiling')

// on user request
function copyWpCmd(type, size, index, cb, err) {
	const cmd = watching.getWpCmd(type, size, index)
	if (cmd instanceof Error) {
		return err(cmd)
	}
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
