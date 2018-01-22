const unixPathLiteral = require('unix-path-literal')
const shellescape = require('shell-escape')

const debug = require('debug')
var log = debug('wp-creative-server:lib:compiling:wp-traffic')

//
function prepareCmd(options) {
	// build settings, ** TODO: integrate with Ad App for client/project, saved profiles, etc
	const env = {
		deploy: {
			source: {
				size: options.size,
				index: options.index
			},
			output: {
				babel: true,
				logs: true
			}
		},
		watch: {
			start: `http://${global.serveIp}:${global.servePort}/api/watch-start/${options.size}/${options.index}/debug`,
			stop: `http://${global.serveIp}:${global.servePort}/api/watch-stop/${options.size}/${options.index}/debug`
		}
	}
	// webpack command
	var cmd = {
		command: 'npx',
		args: ['webpack', '--config', 'webpack.config.js', '--env', JSON.stringify(env), '--colors'],
		cwd: global.servePath,
		out: `.${options.size}_${options.index}`
	}
	// get a shell command
	// cmd.shell = `cd ${unixPathLiteral(cmd.cwd)} && ${cmd.command} ${shellescape(cmd.args)} | tee ${cmd.out}`
	cmd.shell = `cd ${unixPathLiteral(cmd.cwd)} && script '${cmd.out}' ${cmd.command} ${shellescape(cmd.args)}`
	return cmd
}

module.exports = {
	prepareCmd
}
