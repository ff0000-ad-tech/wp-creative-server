const clipboardy = require('clipboardy')
const pkg = require('../../package.json')

const debug = require('@ff0000-ad-tech/debug')
var log = debug('wp-creative-server:rpc:misc')

function getAppMeta(cb) {
	// ** This funciton has been converted to a REST API rount in api.js
	cb({ version: pkg.version })
}
function copyToClipboard(str, cb, err) {
	clipboardy.writeSync(str)
	cb()
}

module.exports = {
	getAppMeta,
	copyToClipboard
}
