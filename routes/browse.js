const fs = require('fs')
const path = require('path')
const serveStatic = require('serve-static')
const serveIndex = require('serve-index')

const utils = require('../lib/utils.js')

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
		(req, res, next) => {
			const type = serveStatic.mime.lookup(req.url)
			// build paths:
			if (req.url.indexOf(utils.BUILD_FOLDER) > -1) {
				return serveStatic(global.servePath, {
					// let folders with index.html pass through
					index: false,
					// render html files as plain text
					setHeaders: (res, path) => {
						if (type === 'text/html') {
							res.setHeader('Content-Type', 'text/plain')
						}
					}
				})(req, res, next)
			} else {
				// all other assets serve static
				return serveStatic(global.servePath)(req, res, next)
			}
		},
		// directories
		serveIndex(global.servePath, {
			template: `${global.appPath}/views/app/public/browse-template/index.html`,
			stylesheet: `${global.appPath}/views/app/public/browse-template/styles.css`,
			icons: true,
			view: 'details'
		})
	)
}
