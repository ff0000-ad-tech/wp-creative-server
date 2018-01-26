import { UPDATE, UPDATE_CURRENT } from './actions.js'

import debug from 'debug'
const log = debug('wp-cs:app:services:reducers:profiles')

export function profiles(state = {}, action) {
	switch (action.type) {
		case UPDATE:
			return Object.assign({}, action.profiles)

		default:
			return state
	}
}

export function currentProfile(state, action) {
	state = state || {
		name: 'default',
		profile: {
			targets: []
		}
	}
	switch (action.type) {
		case UPDATE_CURRENT:
			return Object.assign(state, action.currentProfile)

		default:
			return state
	}
}
