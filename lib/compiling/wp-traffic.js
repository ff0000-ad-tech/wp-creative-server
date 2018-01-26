const unixPathLiteral = require('unix-path-literal')
const shellescape = require('shell-escape')

const debug = require('debug')
var log = debug('wp-creative-server:lib:compiling:wp-traffic')

//
function prepareCmd(outFile, options) {
	// webpack settings
	const env = {
		deploy: {
			source: {
				size: options.size,
				index: options.index
			},
			output: {
				watch: false,
				babel: true,
				logs: true
			}
		},
		watch: {
			start: `http://${global.serveIp}:${global.servePort}/api/watch-start/${options.size}/${options.index}/traffic`,
			stop: `http://${global.serveIp}:${global.servePort}/api/watch-stop/${options.size}/${options.index}/traffic`,
			complete: `http://${global.serveIp}:${global.servePort}/api/watch-complete/${options.size}/${options.index}/traffic/${
				options.profileName
			}`
		}
	}
	// webpack command
	var cmd = {
		command: 'npx',
		args: ['webpack', '--config', 'webpack.config.js', '--env', JSON.stringify(env), '--colors'],
		cwd: global.servePath
	}
	// get a shell command
	// cmd.shell = `cd ${unixPathLiteral(cmd.cwd)} && ${cmd.command} ${shellescape(cmd.args)} | tee ${outFile}`
	cmd.shell = `cd ${unixPathLiteral(cmd.cwd)} && script '${outFile}' ${cmd.command} ${shellescape(cmd.args)}`
	return cmd
}

module.exports = {
	prepareCmd
}
