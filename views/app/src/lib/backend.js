import { update as appMetaUpdate } from '../services/app-meta/actions.js'
import { update as pluginsUpdate } from '../services/plugins/actions.js'
import { update as creativeUpdate } from '../services/creative/actions.js'
import { update as targetsUpdate } from '../services/targets/actions.js'
import { update as profilesUpdate } from '../services/profiles/actions.js'

import debug from '@ff0000-ad-tech/debug'
const log = debug('wp-cs:app:backend')
const log1 = debug('wp-cs:app:backend+')
debug.disable('wp-cs:app:backend+') // comment this line to get an idea of the pace of the update cycle

const axios = require('axios').default

let instance

export default class Backend {
	constructor(options) {
		if (!instance) {
			instance = this
			this.store = options.store
		}
		return instance
	}

	/* -- APP META -------------------------
	*
	*
	*
	*/
	getAppMeta(cb) {
		log('getAppMeta()')
		axios
			.get('/api/get-app-meta')
			.then(res => {
				log('		getAppMeta() res.data:', res.data)
				this.store.dispatch(appMetaUpdate(res.data))
			})
			.catch(error => {
				log(error)
			})
	}

	/* -- PLUGINS -------------------------
	*
	*
	*
	*/
	getPlugins() {
		log('getPlugins()')
		axios
			.get('/api/get-plugins')
			.then(res => {
				log('		getPlugins().res.data:', res.data)
				this.store.dispatch(pluginsUpdate(res.data))
			})
			.catch(error => {
				log(error)
			})
	}

	/* -- CREATIVE -------------------------
	*
	*
	*
	*/
	getCreative() {
		log('getCreative()')
		axios
			.get('/api/get-creative')
			.then(res => {
				log('		getCreative:', res.data)
				this.store.dispatch(creativeUpdate(res.data))
			})
			.catch(error => {
				log(error)
			})
	}

	/* -- TARGETS -------------------------
	*
	*
	*
	*/
	readTargets() {
		log('readTargets()')
		axios
			.get('/api/read-targets')
			.then(res => {
				log1('READ', res.data)
				this.store.dispatch(targetsUpdate(res.data))
			})
			.catch(error => {
				log(error)
			})
	}
	refreshTargets() {
		axios
			.get('/api/refresh-targets')
			.then(res => {
				log1('refresh', res.data)
				this.store.dispatch(targetsUpdate(res.data))
			})
			.catch(error => {
				log(error)
			})
	}

	/* -- COMPILING -------------------------
	*
	*
	*
	*/
	copyWpCmd(ctype, size, index, cb) {
		log('copyWpCmd()')
		axios
			.post('/api/copy-wp-cmd', {
				type: ctype,
				size: size,
				index: index
			})
			.then(res => {
				log('	res.data.shell', res.data.shell)
				cb()
			})
			.catch(error => {
				log(error)
			})
	}

	/* -- PROFILES -------------------------
	*
	*
	*
	*/
	getProfiles() {
		axios
			.get('/api/get-profiles')
			.then(res => {
				log1('res.data', res.data)
				this.store.dispatch(profilesUpdate(res.data))
			})
			.catch(error => {
				alert(error.message)
			})
	}
	newProfile(name) {
		log('newProfile()')
		axios
			.post('/api/new-profile', {
				name: name
			})
			.then(res => {
				this.readTargets()
				this.getProfiles()
			})
			.catch(error => {
				alert(error.message)
			})
	}
	updateProfile(name, profile) {
		log('updateProfile()')
		axios
			.post('/api/update-profile', {
				name: name,
				profile: profile
			})
			.then(res => {
				this.getProfiles()
			})
			.catch(error => {
				alert(error.message)
			})
	}
	deleteProfile(name) {
		log('deleteProfile()')
		axios
			.post('/api/delete-profile', {
				name: name
			})
			.then(res => {
				this.getProfiles()
			})
			.catch(error => {
				alert(error.message)
			})
	}
	addDeployTargets(profiles, name, target) {
		log('addDeployTargets()')
		log('		target:', target)
		// temp add target (to make state snappy)
		profiles[name].targets.push({
			size: target.size,
			index: target.index,
			deployAt: null
		})
		this.store.dispatch(profilesUpdate(profiles))

		// backend add target
		axios
			.post('/api/add-deploy-targets', {
				name: name,
				target: target
			})
			.then(res => {
				this.getProfiles()
			})
			.catch(error => {
				alert(error.message)
			})
	}
	removeDeployTargets(profiles, name, target) {
		log('removeDeployTargets()')
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
		axios
			.post('/api/remove-deploy-targets', {
				name: name,
				target: target
			})
			.then(res => {
				this.getProfiles()
			})
			.catch(error => {
				alert(error.message)
			})
	}

	/* -- PLUGINS -------------------------
	*
	*
	*
	*/
	// npm install git+ssh://git@stash.ff0000.com:7999/at/ad-es6-particles.git --save
	// npm install latest --save
	copyPluginInstallCmd(dep, cb) {
		log('copyPluginInstallCmd()')
		axios
			.post('/api/copy-plugin-install-cmd', {
				plugin: dep
			})
			.then(res => {
				log('	res.data', res.data)
				cb()
			})
			.catch(error => {
				log(error)
			})
	}

	/* -- UTILS -------------------------
	*
	*  This function doesn't seem to actually be used. Remove??
	*
	*/
	copyToClipboard(str, cb) {
		log('copyToClipboard()')
		this.remote.copyToClipboard(str, cb, err => {
			alert(err.message)
		})
	}
}
