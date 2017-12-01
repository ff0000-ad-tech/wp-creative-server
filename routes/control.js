const fs = require('fs');
const path = require('path');

const control = require('../controllers/control.js');

const debug = require('debug');
var log = debug('wp-creative-server:route:control');

module.exports = (app, express) => {


	/* -- CONTROL -----------------------------------
	 *
	 *
	 *
	 */
	app.get('/control', (req, res) => {
		// creative name
		const creativeName = control.getCreativeName();

		// build targets are size-folders containing indexes
		const targets = control.getBuildTargets();

		res.render(
			`${global.appPath}/views/control/index`, {
				creativeName: creativeName,
				targets: targets
			}
		);	
	});

	app.use('/control', express.static(
		`${global.appPath}/views/control`
	));

};