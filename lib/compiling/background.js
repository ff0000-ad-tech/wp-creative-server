const exec = require('child_process').exec

const state = require('../state.js')
const watching = require('./watching.js')
const profiles = require('../profiles.js')
const targets = require('../targets.js')

const debug = require('@ff0000-ad-tech/debug')
var log = debug('wp-creative-server:lib:compiling:background')

const PID_PENDING = 'pending'

function compile(profile, reqTargets) {
	log('compile()')
	for (var id in reqTargets) {
		// only one webpack process per profile/target!
		if (reqTargets[id].watching[profile].pid) {
			continue
		}

		// update state
		state.updateWatch(id, profile, {
			pid: PID_PENDING,
			processing: true
		})
		profiles.markDeployInProgress(profile, reqTargets[id])

		// execute
		const cmd = watching.getWpCmd(targets, profile, reqTargets[id].size, reqTargets[id].index)
		log(cmd.shell)
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

function kill(profile, reqTargets) {
	log('kill()')
	for (var id in reqTargets) {
		const pid = reqTargets[id].watching[profile].pid
		if (pid && pid !== PID_PENDING) {
			const cmd = `kill ${pid}`
			log(cmd)
			exec(cmd, (error, stdout, stderr) => {
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
