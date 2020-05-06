import { update as appMetaUpdate } from '../services/app-meta/actions.js'
import { update as pluginsUpdate } from '../services/plugins/actions.js'
import { update as creativeUpdate } from '../services/creative/actions.js'
import { update as targetsUpdate } from '../services/targets/actions.js'
import { update as profilesUpdate } from '../services/profiles/actions.js'

import debug from '@ff0000-ad-tech/debug'
const log = debug('wp-cs:app:rpc')
const log1 = debug('wp-cs:app:rpc+')
debug.disable('wp-cs:app:rpc+') // comment this line to get an idea of the pace of the update cycle

const axios = require('axios').default

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
		log('rpc.js connect()')
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
		log('rpc.js getAppMeta()')
		// axios.get('../lib/rpc/misc.js:getAppMeta', app => {
		axios
			.get('/api/get-app-meta')
			.then(res => {
				log('		getAppMeta() res.data:', res.data)
				this.store.dispatch(appMetaUpdate(res.data))
			})
			.catch(error => {
				log(error)
			})
		/* this.remote.getAppMeta(app => {
			this.store.dispatch(appMetaUpdate(app))
		}) */
	}

	/* -- PLUGINS -------------------------
	*
	*
	*
	*/
	getPlugins() {
		log('rpc.js getPlugins()')
		axios
			.get('/api/get-plugins')
			.then(res => {
				log('		getPlugins().res.data:', res.data)
				this.store.dispatch(pluginsUpdate(res.data))
			})
			.catch(error => {
				log(error)
			})
		/* this.remote.getPlugins(plugins => {
			this.store.dispatch(pluginsUpdate(plugins))
		}) */
	}

	/* -- CREATIVE -------------------------
	*
	*
	*
	*/
	getCreative() {
		log('rpc.js getCreative()')
		/* axios.get('../lib/rpc/creative.js:getCreative', creative => {
			this.store.dispatch(creativeUpdate(creative))
			log('		getCreative().creative:' + creative)
		}) */
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
		log('rpc.js readTargets()')
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
		// log('rpc.js refreshTargets()')
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
		log('rpc.js copyWpCmd()')
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
		// log('rpc.js getProfiles()')
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
		log('rpc.js newProfile()')
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
		log('rpc.js updateProfile()')
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
		log('rpc.js deleteProfile()')
		this.remote.deleteProfile(
			name,
			() => {
				this.getProfiles()
			},
			err => {}
		)
	}
	addDeployTargets(profiles, name, target) {
		log('rpc.js addDeployTargets()')
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
		log('rpc.js removeDeployTargets()')
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

	/* -- PLUGINS -------------------------
	*
	*
	*
	*/
	// npm install git+ssh://git@stash.ff0000.com:7999/at/ad-es6-particles.git --save
	// npm install latest --save
	copyPluginInstallCmd(dep, cb) {
		log('rpc.js copyPluginInstallCmd()')
		this.remote.copyPluginInstallCmd(dep, cb, err => {
			alert(err.message)
		})
	}

	/* -- UTILS -------------------------
	*
	*
	*
	*/
	copyToClipboard(str, cb) {
		log('rpc.js copyToClipboard()')
		this.remote.copyToClipboard(str, cb, err => {
			alert(err.message)
		})
	}
}
