const fs = require('fs');
const path = require('path');
const moment = require('moment');

const state = require('./state.js');
const webpack = require('./webpack.js');

const debug = require('debug');
var log = debug('wp-creative-server:lib:targets');


function getCreativeName() {
	return path.basename(global.servePath);
}


function generateId(size, index) {
	return `${size}/${index}`; 
}

function newTarget(size, index) {
	var target = {};
	target[generateId(size, index)] = {
		size: size,
		index: index,
		watching: null,
		processing: false,
		error: null,
		updateAt: '', // moment(Date.now() - 10000).from(Date.now()),
		deployAt: '' //moment(Date.now() - 10000).from(Date.now())
	};
	return target;
}





// analyze the file-system
function readTargets() {
	return new Promise((resolve, reject) => {
		// iterate build folder, looking for build-size folders
		const buildPath = `${global.servePath}/build`;

		fs.readdir(buildPath, (err, buildItems) => {
			if (err) {
				return reject(err);
			}
			buildItems.forEach((buildItem) => {
				// locate build-size folders
				if (buildItem.match(/[0-9]+x[0-9]/)) {
					const size = buildItem;

					// iterate build-size folder, looking for index files
					fs.readdir(`${buildPath}/${size}`, (err, sizeItems) => {
						if (err) {
							return reject(err);
						}
						sizeItems.forEach((sizeItem) => {
							// locate index files
							if (sizeItem.match(/index/)) {
								const index = sizeItem;
								state.addTargets(
									newTarget(size, index)
								);
							}
						});	
						resolve(state.getTargets());			
					});
				}
			});
		});
	});
}



function startWatching(target, options) {
	log('startWatching()');
	stopWatching(target);

	// callback to watch stdout for processing
	const intervalId = setInterval(() => {
		if (target.updateAt > Date.now() - 300) {
			log(' - is processing');
			state.updateTarget(target.id, {
				processing: true
			});
		}
		else {
			state.updateTarget(target.id, {
				processing: false
			});
		}
	}, 100);
	const onStdout = function (data) {
		state.updateTarget(target.id, {
			updateAt: Date.now()
		});
	}
	// callback to handle error
	const onStderr = function (data) {
		state.updateTarget(target.id, {
			updateAt: Date.now()
		});
	}
	// callback to handle exit
	const onExit = function (code) {
		log(`process exit: ${code}`);
		if (!code) {
			state.updateTarget(target.id, {
				error: new Error(`Exit code ${code}`)
			});
		}
		stopWatching(target);
	}

	// start watching process
	state.updateTarget(target.id, {
		watching: webpack.start(options, onStdout, onStderr, onExit),
		updateAt: Date.now(),
		intervalId: intervalId
	});
	
}


function stopWatching(target) {
	log('stopWatching()');
	clearInterval(target.intervalId);
	webpack.stop(target.watching);
	state.updateTarget(target.id, {
		watching: null,
		processing: false
	});
}


function stopWatchingAll() {
	log('stopWatchingAll()');
	const targets = state.getTargets();
	for (var i in targets) {
		stopWatching(targets[i]);
	}
}




module.exports = {
	getCreativeName,
	generateId,
	readTargets,
	startWatching,
	stopWatchingAll
};