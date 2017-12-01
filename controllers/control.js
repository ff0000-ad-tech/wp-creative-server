const fs = require('fs');
const path = require('path');

const debug = require('debug');
var log = debug('wp-creative-server:controllers:control');


function getCreativeName() {
	return path.basename(global.servePath);
}


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
			sizeItems.forEach((sizeItem) => {
				// location index files
				if (sizeItem.match(/index/)) {
					targets[buildItem].push(sizeItem);
				}
			});
		}
	});

	return targets;
}


module.exports = {
	getCreativeName,
	getBuildTargets
};