const cp = require('child_process');
const shellescape = require('shell-escape');
const fs = require('fs');
const path = require('path');

const debug = require('debug');
var log = debug('wp-creative-server:lib:webpack');




// start webpack
function start(options) {
	// build settings, ** TODO: integrate with Ad App for client/project, saved profiles, etc
	const env = {
		deploy: {
			source: {
				size: options.size,
				index: options.index
			} 
		}
	};

	// start webpack with settings
	const args = [
		'--config', 'webpack.config.js', 
		'--env', JSON.stringify(env)
	];
	const proc = run(
		'webpack', args, {
			cwd: global.servePath
		}
	);
	return proc;
}


// stop webpack
function stop(proc) {
	proc.kill();
}








function run(command, args, options, callback) {
	callback = callback || handleError;
	log('run ->', command, args);
	log(args);

	var p = cp.spawn(command, args, { cwd: options.cwd });
	// handle process events
	p.stdout.on('data', (data) => {
		log(data);
	});
	p.stderr.on('data', (data) => {
		log(data);
	});
	p.on('error', function (err) {
		callback(err);
	});
	p.on('exit', function (code) {
		var err = code === 0 ? null : new Error('exit code ' + code);
		callback(err);
	});
	return p;
}

function handleError(err) {
	log(err);
}





module.exports = {
	start,
	stop
};