import { update as creativeUpdate } from '../services/creative/actions.js'
import { update as targetsUpdate } from '../services/targets/actions.js'
import { update as profilesUpdate, updateCurrent } from '../services/profiles/actions.js'

import debug from 'debug'
const log = debug('wp-cs:app:rpc')

let instance

export default class Rpc {
	constructor(options) {
		if (!instance) {
			instance = this
			this.store = options.store
		}
		return instance
	}

	// connect-remote is browserified and <script>-loaded
	connect(cb) {
		log('connect()')
		window.connectRemote((err, r) => {
			if (err) {
				throw 'Unable to connect-remote!'
			}
			this.remote = r
			cb()
		})
	}

	/* -- CREATIVE -------------------------
	*
	*
	*
	*/
	getCreative() {
		this.remote.getCreative(creative => {
			this.store.dispatch(creativeUpdate(creative))
		})
	}

	/* -- TARGETS -------------------------
	*
	*
	*
	*/
	getTargets() {
		this.remote.getTargets(
			targets => {
				this.store.dispatch(targetsUpdate(targets))
			},
			err => {
				console.log(err)
			}
		)
	}
	refreshTargets() {
		this.remote.refreshTargets(
			targets => {
				// log(targets)
				this.store.dispatch(targetsUpdate(targets))
			},
			err => {
				console.log(err)
			}
		)
	}

	/* -- COMPILING -------------------------
	*
	*
	*
	*/
	getWpCmd(profileName, size, index, type, cb) {
		this.remote.getWpCmd(cb, err => {
			alert(err.message)
		})
	}

	/* -- PROFILES -------------------------
	*
	*
	*
	*/
	getProfiles() {
		this.remote.getProfiles(
			profiles => {
				this.store.dispatch(profilesUpdate(profiles))

				// determine current profile
				const sortedNames = Object.keys(profiles).sort((a, b) => {
					if (profiles[a].updateAt < profiles[b].updateAt) return 1
					else if (profiles[a].updateAt > profiles[b].updateAt) return -1
					else return 0
				})
				this.store.dispatch(
					updateCurrent({
						name: sortedNames[0],
						profile: profiles[sortedNames[0]]
					})
				)
			},
			err => {
				// TODO: handle RPC errors better, more consistently
				alert(err.message)
			}
		)
	}
	newProfile(name) {
		this.remote.newProfile(
			name,
			() => {
				this.getProfiles()
			},
			err => {}
		)
	}
	updateProfile(name, profile) {
		this.remote.updateProfile(
			name,
			profile,
			() => {
				this.getProfiles()
			},
			err => {}
		)
	}
	deleteProfile(name) {
		this.remote.deleteProfile(
			name,
			() => {
				this.getProfiles()
			},
			err => {}
		)
	}
	addDeployTargets(name, target) {
		this.remote.addDeployTargets(
			name,
			target,
			() => {
				this.getProfiles()
			},
			err => {}
		)
	}
	removeDeployTargets(name, target) {
		this.remote.removeDeployTargets(
			name,
			target,
			() => {
				this.getProfiles()
			},
			err => {}
		)
	}
}
