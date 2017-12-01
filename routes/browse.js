const fs = require('fs');
const path = require('path');
const serveIndex = require('serve-index');

const debug = require('debug');
var log = debug('wp-creative-server:route:browse');


module.exports = (app, express) => {

	/* -- FS BROWSER -----------------------------------
	 *
	 *
	 *
	 */
	app.use('/', 
		express.static(global.servePath), 
		serveIndex(global.servePath, {
			template: `${global.appPath}/views/directory/index.html`,
			stylesheet: `${global.appPath}/views/directory/styles.css`,
			icons: true,
			view: 'details'
		})
	);

	app.use('/directory', express.static(
		`${global.appPath}/views/directory`
	));


};