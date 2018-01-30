import _ from 'lodash'

import { UPDATE_PROFILES, UPDATE_DEPLOY_AT, UPDATE_CURRENT, ADD_PROFILE } from './actions.js'

import debug from 'debug'
const log = debug('wp-cs:app:services:reducers:profiles')

export function profiles(profiles = {}, action) {
	let out
	switch (action.type) {
		case UPDATE_PROFILES:
			return Object.assign({}, action.profiles)

		case UPDATE_DEPLOY_AT:
			out = _.cloneDeep(profiles)
			for (var i in out[action.profile].targets) {
				if (out[action.profile].targets[i].size && out[action.profile].targets[i].index === action.index) {
					out[action.profile].targets[i] = Object.assign(out[action.profile].targets[i], action.deployAt)
					break
				}
			}
			return out

		case ADD_PROFILE:
			out = _.cloneDeep(profiles)
			out[action.profile] = {
				environment: {},
				targets: [],
				updateAt: Date.now()
			}
			return out

		default:
			return profiles
	}
}

export function currentProfile(profiles, action) {
	profiles = profiles || {
		name: 'default',
		profile: {
			targets: []
		}
	}
	switch (action.type) {
		case UPDATE_CURRENT:
			return Object.assign(profiles, action.currentProfile)

		default:
			return profiles
	}
}
