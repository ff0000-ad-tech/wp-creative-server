const wp = require('./node_modules/@ff0000-ad-tech/wp-deploy-manager/webpack.config.js')
// cli > 		start CS with optional --wpDmPath
// wp.js > 	wepack cwd can then be wpDmPath || servePath (build-source)
// here > 	__dirname ('scope') should be
//					merged with config and set to wpDmPath || servePath (build-source)
module.exports = config => {
	return wp.execute(config, __dirname)
}
