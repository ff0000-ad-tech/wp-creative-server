const spawn = require('child_process').spawn
const exec = require('child_process').exec

const state = require('../state.js')
const watching = require('./watching.js')
const profiles = require('../profiles.js')
const targets = require('../targets.js')

const debug = require('@ff0000-ad-tech/debug')
var log = debug('wp-creative-server:lib:compiling:background')
const rowLog = (...args) => {
	log(...args)
}
const PID_PENDING = 'pending'

function compile(profile, reqTargets) {
	rowLog('compile()')
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
		rowLog(cmd.shell)
		const prc = spawn(cmd.command, cmd.args, { cwd: cmd.cwd })
		prc.stdout.on('data', data => {
			// rowLog(data.toString())
		})
		prc.stderr.on('data', data => {
			// rowLog(data.toSTring())
		})
		prc.on('close', code => {
			if (code !== 0) {
				// rowLog(`process exited with code ${code}`)
			}
		})
		prc.on('error', err => {
			rowLog(`Error spawning compile process.`, err)
		})
	}
}

function kill(profile, reqTargets) {
	for (var id in reqTargets) {
		const pid = reqTargets[id].watching[profile].pid
		if (pid && pid !== PID_PENDING) {
			rowLog(` kill watch process: ${profile}/${id}/${pid}`)
			const cmd = `kill ${pid}`
			exec(cmd, (error, stdout, stderr) => {
				if (error) {
					rowLog(`exec error: ${error}`)
					return
				}
				// rowLog(`stdout: ${stdout}`)
				// rowLog(`stderr: ${stderr}`)
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
