const fs = require('fs');
const path = require('path');
const moment = require('moment');

const state = require('./state.js');

const debug = require('debug');
var log = debug('wp-creative-server:lib:targets');


function getCreativeName() {
	return path.basename(global.servePath);
}


function generateId(size, index) {
	return `${size}/${index}`; 
}

function newTarget(size, index) {
	return {
		size: size,
		index: index,
		exec: '', // the command that launched this watch process
		watching: null,
		proc: false,
		stdout: undefined,
		stderr: undefined,
		lastDeployAt: moment(Date.now() - 10000).from(Date.now())
	};
}



// analyze the file-system
function readTargets() {
	return new Promise((resolve, reject) => {
		var targets = {};

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
								const id = generateId(size, index);

								// if target is not already in the state, add it
								if (!state.getTarget(id)) {
									state.addTarget(
										newTarget(size, index)
									);
								}
							}
						});					
					});
				}
			});
		});
	});
}




module.exports = {
	readTargets,
	getCreativeName
};