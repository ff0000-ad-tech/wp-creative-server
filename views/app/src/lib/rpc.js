import { update as creativeUpdate } from '../services/creative/actions.js'
import { update as targetsUpdate } from '../services/targets/actions.js'
import { update as profilesUpdate } from '../services/profiles/actions.js'

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

	/* -- RPC METHODS/CALLBACKS -------------------------
	*
	*
	*
	*/
	getCreative() {
		this.remote.getCreative(creative => {
			this.store.dispatch(creativeUpdate(creative))
		})
	}
	getTargets() {
		this.remote.getTargets(targets => {
			this.store.dispatch(targetsUpdate(targets))
		})
	}
	getProfiles() {
		this.remote.getProfiles(
			profiles => {
				this.store.dispatch(profilesUpdate(profiles))
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
}
