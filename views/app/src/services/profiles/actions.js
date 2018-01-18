export const UPDATE = 'PROFILES-UPDATE'

export function update(profiles) {
	return {
		type: UPDATE,
		profiles
	}
}
