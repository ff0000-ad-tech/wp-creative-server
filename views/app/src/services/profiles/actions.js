import debug from 'debug'
const log = debug('wp-cs:app:services:actions:profiles')

export const UPDATE = 'PROFILES-UPDATE'
export function update(profiles) {
	return (dispatch, getState) => {
		dispatch(updateProfiles(profiles))
		dispatch(updateCurrent())
	}
}

export const UPDATE_PROFILES = 'PROFILES-UPDATE'
export function updateProfiles(profiles) {
	return {
		type: UPDATE_PROFILES,
		profiles
	}
}

export const UPDATE_CURRENT = 'PROFILES-UPDATE-CURRENT'
export function updateCurrent() {
	return (dispatch, getState) => {
		const p = getState().profiles
		// determine current profile
		const sortedNames = Object.keys(p).sort((a, b) => {
			if (p[a].updateAt < p[b].updateAt) return 1
			else if (p[a].updateAt > p[b].updateAt) return -1
			else return 0
		})
		dispatch({
			type: UPDATE_CURRENT,
			currentProfile: {
				name: sortedNames[0],
				profile: p[sortedNames[0]]
			}
		})
	}
}

export const UPDATE_DEPLOY_AT = 'TARGETS-UPDATE-DEPLOY-AT'
export function updateDeployAt(profile, size, index, deployAt) {
	return dispatch => {
		dispatch({
			type: UPDATE_DEPLOY_AT,
			profile,
			size,
			index,
			deployAt
		})
		dispatch(updateCurrent())
	}
}

export const ADD_PROFILE = 'TARGETS-ADD-PROFILE'
export function addProfile(profile) {
	return dispatch => {
		dispatch({
			type: ADD_PROFILE,
			profile
		})
		dispatch(updateCurrent())
	}
}
