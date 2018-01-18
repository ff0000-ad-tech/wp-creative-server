import { update as creativeUpdate } from '../services/creative/actions.js'
import { update as targetsUpdate } from '../services/targets/actions.js'
import { update as profilesUpdate } from '../services/profiles/actions.js'

let remote, store

export function init(options) {
	store = options.store
}

// connect-remote is browserified and <script>-loaded
export function connect(cb) {
	window.connectRemote((err, r) => {
		if (err) {
			throw 'Unable to connect-remote!'
		}
		remote = r
		cb()
	})
}

/* -- RPC METHODS/CALLBACKS -------------------------
 *
 *
 *
 */
export function getCreative() {
	remote.getCreative(creative => {
		store.dispatch(creativeUpdate(creative))
	})
}
export function getTargets() {
	remote.getTargets(targets => {
		store.dispatch(targetsUpdate(targets))
	})
}
export function getProfiles() {
	remote.getProfiles(profiles => {
		store.dispatch(profilesUpdate(profiles))
	}, err => {
		alert(err.message)
	})
}
