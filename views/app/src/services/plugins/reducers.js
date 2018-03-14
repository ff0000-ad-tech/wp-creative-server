import { UPDATE } from './actions.js'

export function plugins(state = {}, action) {
	switch (action.type) {
		case UPDATE:
			return Object.assign({}, action.plugins)
		default:
			return state
	}
}
