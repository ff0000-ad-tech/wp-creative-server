const timeout = require('../lib/timeout.js')
const log = require('@ff0000-ad-tech/debug')('wp-creative-server:middleware')

// subpage middleware
const markActivity = async (req, res, next) => {
	timeout.resetCsTimeout()
	next()
}

module.exports = {
	markActivity
}
