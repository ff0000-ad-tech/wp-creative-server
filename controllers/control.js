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
			targets[buildItem] = [];

			// iterate build-size folder, looking for index files
			const sizeItems = fs.readdirSync(
				`${buildPath}/${buildItem}`
			);
			sizeItems.forEach((sizeItem, i) => {
				// locate index files
				if (sizeItem.match(/index/)) {
					targets[buildItem].push({
						name: sizeItem,
						isWatching: i % 2,
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
	watching.forEach((watch) => {
		if (watch.size == size && watch.index == index) {
			return watch;
		}
	});
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
		'webpack', '--config', `${global.servePath}/webpack.config.js`, '--env', ${JSON.stringify(env)
	];
	const p = wp.run(args, handleWatchExit);

	// watch webpack process
	const watch = {
		size: size,
		index: index,
		process: p
	};
	watching.push(watch);
	log(`Watching: ${size}/${index}`);
}



function stopWatching(size, index) {
	const watch = getWatchProcess(size, index);
	if (watch) {
		log('Stop watching:');
		log(watch);
		watch.process.kill();
	}
}



function handleWatchExit(err) {
	log('!!! Watch Process EXIT !!!');
}


module.exports = {
	getCreativeName,
	getBuildTargets,

	startWatching,
	stopWatching
};