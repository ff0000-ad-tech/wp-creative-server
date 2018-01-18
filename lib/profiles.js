const fs = require('fs')
const path = require('path')

const state = require('./state.js')

const debug = require('debug')
var log = debug('wp-creative-server:lib:profiles')


function getProfiles() {
	const buildPackagePath = `${global.servePath}/build/package.json`
	if (fs.existsSync(buildPackagePath)) {
		try {
			const packageJson = require(buildPackagePath)
			return 'profiles' in packageJson ? packageJson.profiles : {}	
		}
		catch(err) {
			return new Error('Unable to parse build/package.json')
		}
	}
	return {}
}



module.exports = {
	getProfiles
}
