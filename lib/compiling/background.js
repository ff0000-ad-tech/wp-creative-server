const exec = require('child_process').exec

const state = require('../state.js')
const watching = require('./watching.js')
const profiles = require('../profiles.js')

const debug = require('@ff0000-ad-tech/debug')
var log = debug('wp-creative-server:lib:compiling:background')

const PID_PENDING = 'pending'

function compile(profile, targets) {
	log('compile()')
	for (var id in targets) {
		// only one webpack process per profile/target!
		if (targets[id].watching[profile].pid) {
			continue
		}

		// update state
		state.updateWatch(id, profile, {
			pid: PID_PENDING,
			processing: true
		})
		profiles.markDeployInProgress(profile, targets[id])

		// execute
		const cmd = watching.getWpCmd(profile, targets[id].size, targets[id].index)
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

function kill(profile, targets) {
	for (var id in targets) {
		const pid = targets[id].watching[profile].pid
		if (pid && pid !== PID_PENDING) {
			log(` kill watch process: ${profile}/${id}/${pid}`)
			const cmd = `kill ${pid}`
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

function killAll() {
	const targets = state.getTargets()
	const profileKeys = Object.keys(profiles.getProfiles()).concat('debug')
	profileKeys.forEach(profile => {
		kill(profile, targets)
	})
}

module.exports = {
	compile,
	kill,
	killAll
}
