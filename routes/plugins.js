const fs = require('fs')
const path = require('path')

const plugins = require('../lib/plugins.js')

const debug = require('debug')
var log = debug('wp-creative-server:route:plugins')

module.exports = (app, express) => {
	/* -- DYNAMIC PLUGIN ROUTES -----------------------------------
	 *
	 *
	 *
	 */
	const installed = plugins.getInstalled()
	Object.keys(installed).forEach(plugin => {
		// plugin package must specify "main", path to servable directory
		if (!('main' in installed[plugin])) {
			return
		}
		const staticRoute = `${global.servePath}/node_modules/${plugin}/${path.dirname(installed[plugin].main)}`
		if (!fs.existsSync(staticRoute)) {
			return
		}

		// serve static plugin assets
		app.use(`/${plugin}`, express.static(`${staticRoute}`))

		// proxy plugin routes
		app.get(`/${plugin}/*`, (req, res) => {
			log(req.params)
			res.sendFile(`${staticRoute}/`)
		})
	})
}
