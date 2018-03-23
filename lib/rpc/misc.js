const clipboardy = require('clipboardy')
const pkg = require('../../package.json')

const debug = require('debug')
var log = debug('wp-creative-server:rpc:misc')

function getAppMeta(cb) {
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
