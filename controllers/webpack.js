const cp = require('child_process');
const shellescape = require('shell-escape');
const fs = require('fs');
const path = require('path');

const debug = require('debug');
var log = debug('wp-creative-server:controllers:webpack');



function run(args, callback) {
	const command = shellescape(args);
	log('run ->', command);
	var p = cp.spawn(command);
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



module.exports = {
	run
};