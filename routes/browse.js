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
	
  

  /** DEPRECATED --->
   */
	app.use('/browse', express.static(`${global.appPath}/views/browse`))

	app.use(
    '/browse-panel',
    express.static(global.servePath),
    serveIndex(global.servePath, {
      template: `${global.appPath}/views/browse/index.html`,
      stylesheet: `${global.appPath}/views/browse/styles.css`,
      icons: true,
      view: 'details'
    })
  )

	app.use('/browse-panel', express.static(`${global.appPath}/views/app/public/browse-template`))
	
	app.use('/shared', express.static(`${global.appPath}/views/static`))
}
