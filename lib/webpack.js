const cp = require('child_process')
const shellescape = require('shell-escape')
const unixPathLiteral = require('unix-path-literal')
const fs = require('fs')
const path = require('path')

const debug = require('debug')
var log = debug('wp-creative-server:lib:webpack')

//
function prepareWatch(options) {
	// build settings, ** TODO: integrate with Ad App for client/project, saved profiles, etc
	const env = {
		deploy: {
			source: {
				size: options.size,
				index: options.index
			}
		},
		watch: {
			start: `http://${global.serveIp}:${global.servePort}/api/watch-start/${options.size}/${options.index}`,
			stop: `http://${global.serveIp}:${global.servePort}/api/watch-stop/${options.size}/${options.index}`
		}
	}
	// webpack command
	var cmd = {
		command: 'webpack',
		args: ['--config', 'webpack.config.js', '--env', JSON.stringify(env), '--colors'],
		cwd: global.servePath,
		out: `.${options.size}_${options.index}`
	}
	// get a shell command
	cmd.shell = `cd ${unixPathLiteral(cmd.cwd)} && ${cmd.command} ${shellescape(cmd.args)} | tee ${cmd.out}`
	return cmd
}

module.exports = {
	prepareWatch
	// start,
	// stop
}
