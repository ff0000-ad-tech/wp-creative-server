import { UPDATE } from './actions.js'

export function profiles(state = {}, action) {
	switch (action.type) {
		case UPDATE:
			return Object.assign({}, action.profiles)
		default:
			return state
	}
}
