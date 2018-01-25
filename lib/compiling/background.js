const exec = require('child_process').exec

const state = require('../state.js')

const debug = require('debug')
var log = debug('wp-creative-server:lib:compiling:background')

function compile(type, targets) {
	log('compile()')
	for (var id in targets) {
		const proc = exec(targets[id][type].cmd.shell, (error, stdout, stderr) => {
			if (error) {
				log(`exec error: ${error}`)
				return
			}
			// log(`stdout: ${stdout}`)
			// log(`stderr: ${stderr}`)
		})
		state.updateProcess(targets, type, proc)
	}
}

function kill(type, targets) {
	log('kill()')
	for (var id in targets) {
		exec(`kill ${targets[id][type].pid}`, (error, stdout, stderr) => {
			if (error) {
				log(`exec error: ${error}`)
				return
			}
			// log(`stdout: ${stdout}`)
			// log(`stderr: ${stderr}`)
		})
		state.updateProcess(targets, type, null)
	}
}

module.exports = {
	compile,
	kill
}
