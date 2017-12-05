const cp = require('child_process');
const shellescape = require('shell-escape');
const unixPathLiteral = require('unix-path-literal');
const fs = require('fs');
const path = require('path');

const debug = require('debug');
var log = debug('wp-creative-server:lib:webpack');




// start webpack
function start(options, onStdout, onError, onExit) {
	// build settings, ** TODO: integrate with Ad App for client/project, saved profiles, etc
	const env = {
		deploy: {
			source: {
				size: options.size,
				index: options.index
			} 
		}
	};

	// webpack command
	const command = 'webpack';
	const args = [
		'--config', 'webpack.config.js', 
		'--env', JSON.stringify(env)
	];
	const cwd = global.servePath;

	// run it
	const proc = run(command, args, {
			cwd: cwd
		},
		onStdout, onError, onExit
	);

	// return watching reference
	return {
		subprocess: proc,
		command: command,
		args: args,
		cwd: cwd,
		execLiteral: `cd ${unixPathLiteral(cwd)} && ${command} ${args.join(' ')}`
	};
}


// stop watch ref
function stop(watching) {
	if (watching && watching.subprocess) {
		log(`stop -> ${watching.command} (${watching.subprocess.pid})`);
		watching.subprocess.kill();
	}
}








function run(command, args, options, onStdout, onError, onExit) {
	var proc = cp.spawn(command, args, { cwd: options.cwd });
	log(`run -> ${command} (${proc.pid})`);
	log(args);

	// handle process events
	proc.stdout.on('data', (data) => {
		onStdout(data);
	});
	proc.stderr.on('data', (data) => {
		onError(data);
	});
	proc.on('error', function (err) {
		onError(err);
	});
	proc.on('exit', function (code) {
		var err = code === 0 ? null : new Error('exit code ' + code);
		onExit(err);
	});

	return proc;
}







module.exports = {
	start,
	stop
};