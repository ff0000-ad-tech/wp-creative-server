const exec = require('child_process').exec

const state = require('../state.js')
const watching = require('./watching.js')

const debug = require('debug')
var log = debug('wp-creative-server:lib:compiling:background')

function compile(ctype, targets) {
	log('compile()')
	for (var id in targets) {
		const cmd = watching.getWpCmd(ctype, targets[id].size, targets[id].index)
		exec(cmd.shell, (error, stdout, stderr) => {
			if (error) {
				log(`exec error: ${error}`)
				return
			}
			// log(`stdout: ${stdout}`)
			// log(`stderr: ${stderr}`)
		})
	}
}

function kill(ctype, targets) {
	log('kill()')
	for (var id in targets) {
		const pid = state.getBgProcess(profile, ctype, target[id])
		exec(`kill ${pid}`, (error, stdout, stderr) => {
			if (error) {
				log(`exec error: ${error}`)
				return
			}
			// log(`stdout: ${stdout}`)
			// log(`stderr: ${stderr}`)
		})
		state.updateProcess(profile, ctype, target[id], null)
	}
}

module.exports = {
	compile,
	kill
}
