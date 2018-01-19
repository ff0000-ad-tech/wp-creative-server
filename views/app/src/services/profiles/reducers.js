import { UPDATE, LIST } from './actions.js'

export function profiles(state = {}, action) {
	switch (action.type) {
		case UPDATE:
			return Object.assign({}, action.profiles)

		default:
			return state
	}
}

export function sorted(state = [], action) {
	switch (action.type) {
		case LIST:
			const profiles = Object.keys(action.profiles).map(name => {
				let profile = Object.assign({}, action.profiles[name])
				profile.name = name
				return profile
			})
			return profiles.sort((a, b) => {
				if (a.updateAt < b.updateAt) return 1
				else if (a.updateAt > b.updateAt) return -1
				else return 0
			})

		default:
			return state
	}
}
