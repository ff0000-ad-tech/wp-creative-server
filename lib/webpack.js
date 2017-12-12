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
		server: {
			watch: 
			out: `.${options.size}_${options.index}`
		}
	}
	// webpack command
	var cmd = {
		command: 'webpack',
		args: ['--config', 'webpack.config.js', '--env', JSON.stringify(env)],
		cwd: global.servePath
	}
	// get copy-and-test unix command
	cmd.execLiteral = `cd ${unixPathLiteral(cmd.cwd)} && script ${env.server.out} ${
		cmd.command
	} ${shellescape(cmd.args)}`
	return cmd
}

// start webpack
function start(options, onStdout, onStderr, onExit) {
	const cmd = prepareWatch(options)
	// run it
	cmd.subprocess = run(
		cmd.command,
		cmd.args,
		{
			cwd: cmd.cwd
		},
		onStdout,
		onStderr,
		onExit
	)
	return cmd
}

// stop watch ref
function stop(watching) {
	if (watching && watching.subprocess) {
		log(`stop -> ${watching.command} (${watching.subprocess.pid})`)
		watching.subprocess.kill()
	}
}

function run(command, args, options, onStdout, onStderr, onExit) {
	var proc = cp.spawn(command, args, { cwd: options.cwd })
	log(`run -> ${command} (${proc.pid})`)
	log(args)

	// handle process events
	proc.stdout.on('data', data => {
		onStdout(data)
	})
	proc.stderr.on('data', data => {
		onStderr(data)
	})
	proc.on('exit', function(code) {
		onExit(code)
	})

	return proc
}

module.exports = {
	prepareWatch,
	start,
	stop
}
