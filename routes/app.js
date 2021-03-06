const fs = require('fs')
const path = require('path')

const debug = require('@ff0000-ad-tech/debug')
var log = debug('wp-creative-server:route:app')

module.exports = (app, express) => {
	/* -- CONTROL -----------------------------------
	 *
	 *
	 *
	 */
	app.use('/app-public', express.static(`${global.appPath}/views/app/public/`))
	app.get('/app*', (req, res) => {
		res.sendFile(`${global.appPath}/views/app/public/index.html`)
	})
}
