const debug = require('debug')
var log = debug('wp-creative-server:utils')

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

module.exports = {
	format
}
