import { UPDATE } from './actions.js'

export function creative(state = {}, action) {
	switch (action.type) {
		case UPDATE:
			return Object.assign({}, action.creative)
		default:
			return state
	}
}
