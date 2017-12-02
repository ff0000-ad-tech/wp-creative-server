const fs = require('fs');
const path = require('path');
const moment = require('moment');

const wp = require('./webpack.js');

const debug = require('debug');
var log = debug('wp-creative-server:controllers:control');


function getCreativeName() {
	return path.basename(global.servePath);
}


// analyze the file-system
function getBuildTargets() {
	log('getBuildTargets()');

	var targets = {};

	// iterate build folder, looking for build-size folders
	const buildPath = `${global.servePath}/build`;

	const buildItems = fs.readdirSync(buildPath);
	buildItems.forEach((buildItem) => {
		// locate build-size folders
		if (buildItem.match(/[0-9]+x[0-9]/)) {
			const size = buildItem;
			targets[size] = [];

			// iterate build-size folder, looking for index files
			const sizeItems = fs.readdirSync(
				`${buildPath}/${size}`
			);
			sizeItems.forEach((sizeItem, i) => {
				// locate index files
				if (sizeItem.match(/index/)) {
					const index = sizeItem;
					targets[size].push({
						name: index,
						isWatching: getWatchProcess(size, index) ? true : false,
						lastDeployAt: moment(Date.now() - 10000).from(Date.now())
					});
				}
			});
		}
	});
	return targets;
}


var watching = [];

function getWatchProcess(size, index) {
	for(var i in watching) {
		if (watching[i].size == size && watching[i].index == index) {
			return watching[i];
		}
	}
}


function startWatching(size, index) {
	// already watching
	if (getWatchProcess(size, index)) {
		return;
	}

	// build settings, TODO: integrate with Ad App for client/project, saved profiles, etc
	const env = {
		deploy: {
			source: {
				size: size,
				index: index
			} 
		}
	};

	// start webpack with settings
	const args = [
		'--config', 'webpack.config.js', 
		'--env', JSON.stringify(env)
	];
	const p = wp.run(
		'webpack', args,
		global.servePath
	);

	// watch webpack process, TODO: pipe process outputs back to application
	const watch = {
		size: size,
		index: index,
		process: p
	};
	watching.push(watch);
	log(`Watching: ${size}/${index}`);
}



function stopWatching(size, index) {
	for(var i in watching) {
		if (watching[i].size == size && watching[i].index == index) {
			log(`Stop watching: ${size}/${index}`);
			watching[i].process.kill();
			watching.splice(i, 1)
		}
	}
}






module.exports = {
	getCreativeName,
	getBuildTargets,

	startWatching,
	stopWatching
};