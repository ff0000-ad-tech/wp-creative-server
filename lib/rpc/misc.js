const clipboardy = require('clipboardy')

const debug = require('debug')
var log = debug('wp-creative-server:rpc:misc')

function copyToClipboard(str, cb, err) {
	clipboardy.writeSync(str)
	cb()
}

module.exports = {
	copyToClipboard
}
