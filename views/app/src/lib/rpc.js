import { update as creativeUpdate } from '../services/creative/actions.js'
import { update as targetsUpdate } from '../services/targets/actions.js'

let remote, store

export function init(options) {
	store = options.store
}

// connect-remote is browserified and <script>-loaded
export function connect() {
	window.connectRemote((err, r) => {
		if (err) {
			throw 'Unable to connect-remote!'
		}
		remote = r
		getCreative()
		getTargets()
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
