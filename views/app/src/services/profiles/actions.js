export const UPDATE = 'PROFILES-UPDATE'
export function update(profiles) {
	return {
		type: UPDATE,
		profiles
	}
}

export const UPDATE_CURRENT = 'UPDATE-CURRENT'
export function updateCurrent(currentProfile) {
	return {
		type: UPDATE_CURRENT,
		currentProfile
	}
}
