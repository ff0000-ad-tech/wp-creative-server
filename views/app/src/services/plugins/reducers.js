import { UPDATE } from './actions.js'

export function plugins(state = {}, action) {
	switch (action.type) {
		case UPDATE:
			if (action.plugins) {
				return Object.assign({}, action.plugins)
			}
			return state
		default:
			return state
	}
}
