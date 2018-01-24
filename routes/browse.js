const fs = require('fs')
const path = require('path')
const serveIndex = require('serve-index')

const debug = require('debug')
var log = debug('wp-creative-server:route:browse')

module.exports = (app, express) => {
	/* -- FS BROWSER -----------------------------------
	 *
	 *
	 *
	 */
	app.use(
		'/',
		express.static(global.servePath),
		serveIndex(global.servePath, {
			template: `${global.appPath}/views/app/public/browse-template/index.html`,
			stylesheet: `${global.appPath}/views/app/public/browse-template/styles.css`,
			icons: true,
			view: 'details'
		})
	)
}
