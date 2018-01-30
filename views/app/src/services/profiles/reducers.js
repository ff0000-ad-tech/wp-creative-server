import _ from 'lodash'

import { UPDATE_PROFILES, UPDATE_DEPLOY_AT, UPDATE_CURRENT } from './actions.js'

import debug from 'debug'
const log = debug('wp-cs:app:services:reducers:profiles')

export function profiles(profiles = {}, action) {
	switch (action.type) {
		case UPDATE_PROFILES:
			return Object.assign({}, action.profiles)

		case UPDATE_DEPLOY_AT:
			let out = _.cloneDeep(profiles)
			for (var i in out[action.profile].targets) {
				if (out[action.profile].targets[i].size && out[action.profile].targets[i].index === action.index) {
					out[action.profile].targets[i] = Object.assign(out[action.profile].targets[i], action.deployAt)
					break
				}
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
