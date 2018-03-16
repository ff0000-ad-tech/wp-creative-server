const BUILD_FOLDER = '1-build'
const DEBUG_FOLDER = '2-debug'
const TRAFFIC_FOLDER = '3-traffic'

/**
 * @method format
 * @desc utility for formatting/pruning specific keys out of state objects
 * @param {object} obj
 * @param {func} schema formats values of obj with matching callbacks in schema
 */
function format(obj, schema, strict) {
	var out = Object.keys(obj).reduce((out, i) => {
		if (i in schema) {
			out[i] = schema[i](obj[i])
		} else if (!strict) {
			out[i] = obj[i]
		}
		return out
	}, {})
	return out
}

function copyToClipboard(str, cb, err) {
	const clipboardy = require('clipboardy')
	clipboardy.writeSync(str)
	cb()
}

module.exports = {
	BUILD_FOLDER,
	DEBUG_FOLDER,
	TRAFFIC_FOLDER,
	format,
	copyToClipboard
}
