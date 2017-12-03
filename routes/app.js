const fs = require('fs');
const path = require('path');

const control = require('../controllers/control.js');

const debug = require('debug');
var log = debug('wp-creative-server:route:app');

module.exports = (app, express) => {


	/* -- CONTROL -----------------------------------
	 *
	 *
	 *
	 */
	app.get('/app', (req, res) => {
		res.sendFile(`${global.appPath}/views/app/public/index.html`)	
	});

	app.use('/app', express.static(
		`${global.appPath}/views/app/public/`
	));

};