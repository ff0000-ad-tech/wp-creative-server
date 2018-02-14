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
			api: `http://${global.serveIp}:${global.servePort}/api`,
			key: `/${ctype}/${size}/${index}`,
			watch: {
				start: `/watch-start`,
				stop: `/watch-stop`,
				complete: `/watch-complete`
			},
			processing: {
				start: `/processing-start`,
				stop: `/processing-stop`
			},
			error: {
				dispatch: `/error-dispatch`,
				reset: `/error-reset`
			}
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
