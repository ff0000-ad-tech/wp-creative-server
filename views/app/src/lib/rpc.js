import { update } from '../services/targets/actions.js';

let remote, store;

export function init(options) {
	store = options.store;
}

// connect-remote is browserified and <script>-loaded
export function connect() {
	window.connectRemote((err, r) => {
		if (err) {
			throw('Unable to connect-remote!');
		}
		remote = r;
		updateTargets();
	});

}

/* -- RPC METHODS/CALLBACKS -------------------------
 *
 *
 *
 */
export function updateTargets() {
	remote.getState('targets', function (targets) {
		store.dispatch(update(targets))
	});
}