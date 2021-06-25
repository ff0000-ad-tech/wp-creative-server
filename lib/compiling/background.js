const spawn = require('child_process').spawn
const exec = require('child_process').exec

const state = require('../state.js')
const watching = require('./watching.js')
const profiles = require('../profiles.js')
const targets = require('../targets.js')

const debug = require('@ff0000-ad-tech/debug')
var log = debug('wp-creative-server:lib:compiling:background')
const mLog = (...args) => {
	log(...args)
}
const PID_PENDING = 'pending'

function compile(profile, reqTargets) {
	mLog('compile()')
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
		mLog(cmd.shell)
		spawn(cmd.command, cmd.args, { cwd: cmd.cwd, stdio: 'inherit' }) // inherit cs process, so we get pretty output in terminal
	}
}

const kill = async (profile, reqTargets) => {
	return new Promise((resolve, reject) => {
		for (var id in reqTargets) {
			const pid = reqTargets[id].watching[profile].pid
			if (pid && pid !== PID_PENDING) {
				mLog(` kill watch process: ${profile}/${id}/${pid}`)
				const cmd = `kill ${pid}`
				exec(cmd, (err, stdout, stderr) => {
					if (err) {
						mLog(`exec error: ${err}`)
						return reject(err)
					}
					resolve()
				})
			} else {
				resolve()
			}
		}
	})
}

const killAll = async () => {
	const targets = state.getTargets()
	// get all profile compiles, plus the always-single debug profile
	const profileKeys = [...Object.keys(profiles.getProfiles()), 'debug']
	await Promise.all(profileKeys.map(async profile => await kill(profile, targets)))
}

module.exports = {
	compile,
	kill,
	killAll
}
