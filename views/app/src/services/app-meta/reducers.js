import { UPDATE } from './actions.js'

export function appMeta(state = {}, action) {
	switch (action.type) {
		case UPDATE:
			return Object.assign({}, action.app)
		default:
			return state
	}
}
