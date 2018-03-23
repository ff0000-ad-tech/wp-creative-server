import { update as appMetaUpdate } from '../services/app/actions.js'
import { update as pluginsUpdate } from '../services/plugins/actions.js'
import { update as creativeUpdate } from '../services/creative/actions.js'
import { update as targetsUpdate } from '../services/targets/actions.js'
import { update as profilesUpdate } from '../services/profiles/actions.js'

import debug from 'debug'
const log = debug('wp-cs:app:rpc')
const log1 = debug('wp-cs:app:rpc+')
debug.disable('wp-cs:app:rpc+') // comment this line to get an idea of the pace of the update cycle

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

	/* -- APP META -------------------------
	*
	*
	*
	*/
	getAppMeta(cb) {
		this.remote.getAppMeta(app => {
			this.store.dispatch(appMetaUpdate(app))
		})
	}

	/* -- PLUGINS -------------------------
	*
	*
	*
	*/
	getPlugins() {
		this.remote.getPlugins(plugins => {
			this.store.dispatch(pluginsUpdate(plugins))
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
	readTargets() {
		this.remote.readTargets(
			targets => {
				log1('READ', targets)
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
				log1('refresh', targets)
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
	copyWpCmd(ctype, size, index, cb) {
		this.remote.copyWpCmd(ctype, size, index, cb, err => {
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
				log1('profiles', profiles)
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
				this.readTargets()
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
	addDeployTargets(profiles, name, target) {
		// temp add target (to make state snappy)
		profiles[name].targets.push({
			size: target.size,
			index: target.index,
			deployAt: null
		})
		this.store.dispatch(profilesUpdate(profiles))

		// backend add target
		this.remote.addDeployTargets(
			name,
			target,
			() => {
				this.getProfiles()
			},
			err => {}
		)
	}
	removeDeployTargets(profiles, name, target) {
		// temp remove target (to make state snappy)
		profiles[name].targets = profiles[name].targets.filter(ptarget => {
			if (ptarget.size === target.size && ptarget.index === target.index) {
				return false
			} else {
				return true
			}
		})
		this.store.dispatch(profilesUpdate(profiles))

		// backend remove target
		this.remote.removeDeployTargets(
			name,
			target,
			() => {
				this.getProfiles()
			},
			err => {}
		)
	}

	/* -- UTILS -------------------------
	*
	*
	*
	*/
	copyToClipboard(str, cb) {
		this.remote.copyToClipboard(str, cb, err => {
			alert(err.message)
		})
	}
}
