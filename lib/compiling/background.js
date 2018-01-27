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
	for (var id in targets) {
		log(
			'TODO: state management of watching[ctype] is glitchy: the complete model gets replaced at some point with the paired-down, frontend version'
		)
		log(targets[id].watching[ctype])
		const pid = targets[id].watching[ctype].pid
		log(pid)
		if (pid) {
			log('kill(), pid:', pid)
			exec(`kill ${pid}`, (error, stdout, stderr) => {
				if (error) {
					log(`exec error: ${error}`)
					return
				}
				// log(`stdout: ${stdout}`)
				// log(`stderr: ${stderr}`)
			})
		}
	}
}

module.exports = {
	compile,
	kill
}
