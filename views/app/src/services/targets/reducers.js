import { UPDATE, UPDATE_WATCH } from './actions.js'

import debug from '@ff0000-ad-tech/debug'
const log = debug('wp-cs:app:services:reducers:targets')

export function targets(targets = {}, action) {
	switch (action.type) {
		case UPDATE:
			return Object.assign({}, action.targets)

		case UPDATE_WATCH:
			let out = {}
			for (var i in targets) {
				out[i] = Object.assign({}, targets[i])
				if (out[i].size === action.size && out[i].index === action.index) {
					out[i].watching[action.profile] = Object.assign({}, out[i].watching[action.profile], action.watching)
				}
			}
			// log(JSON.stringify(out, null, 2))
			return out

		default:
			return targets
	}
}
