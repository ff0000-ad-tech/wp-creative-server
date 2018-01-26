const unixPathLiteral = require('unix-path-literal')
const shellescape = require('shell-escape')

const debug = require('debug')
var log = debug('wp-creative-server:lib:compiling:wp')

//
function prepareCmd(outFile, ctype, params) {
	const size = params.deploy.source.size
	const index = params.deploy.source.index
	// webpack settings
	const env = {
		deploy: params.deploy,
		watch: {
			start: `http://${global.serveIp}:${global.servePort}/api/watch-start/${ctype}/${size}/${index}`,
			stop: `http://${global.serveIp}:${global.servePort}/api/watch-stop/${ctype}/${size}/${index}`,
			complete: `http://${global.serveIp}:${global.servePort}/api/watch-complete/${ctype}/${size}/${index}`
		}
	}
	// webpack command
	var cmd = {
		command: 'npx',
		args: ['webpack', '--config', 'webpack.config.js', '--env', JSON.stringify(env), '--colors'],
		cwd: global.servePath
	}
	// get a shell command
	cmd.shell = `cd ${unixPathLiteral(cmd.cwd)} && script '${outFile}' ${cmd.command} ${shellescape(cmd.args)}`
	return cmd
}

module.exports = {
	prepareCmd
}
