const state = require('../state.js')
const utils = require('../utils.js')

const debug = require('debug')
var log = debug('wp-creative-server:rpc:creative')
// SILENCE
debug.disable('wp-creative-server:rpc:creative')

// get current creative
function getCreative(cb, err) {
	log('getCreative()')
	var out = {
		name: state.getCreativeName()
	}
	cb(out)
}

module.exports = {
	getCreative
}
