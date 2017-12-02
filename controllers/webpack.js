const cp = require('child_process');
const shellescape = require('shell-escape');
const fs = require('fs');
const path = require('path');

const debug = require('debug');
var log = debug('wp-creative-server:controllers:webpack');



function run(command, args, cwd, callback) {
	callback = callback || handleError;
	log('run ->', command, args);
	log(args);

	var p = cp.spawn(command, args, { cwd });
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
	run
};