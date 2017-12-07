const fs = require('fs')
const path = require('path')

const targets = require('../lib/targets.js')
const state = require('../lib/state.js')

const debug = require('debug')
var log = debug('wp-creative-server:route:control')

module.exports = (app, express) => {
	/* -- CONTROL -----------------------------------
	 *
	 *
	 *
	 */
	app.get('/control', (req, res) => {
		// creative name
		const creativeName = targets.getCreativeName()

		// refresh targets and update state
		targets.readTargets()

		res.render(`${global.appPath}/views/control/index`, {
			creativeName: creativeName,
			targets: state.getTargets()
		})
	})

	app.use('/control', express.static(`${global.appPath}/views/control`))
}
