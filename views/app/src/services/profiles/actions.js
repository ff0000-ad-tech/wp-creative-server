export const UPDATE = 'PROFILES-UPDATE'
export function update(profiles) {
	return {
		type: UPDATE,
		profiles
	}
}

export const LIST = 'PROFILES-LIST'
export function list(profiles) {
	return {
		type: LIST,
		profiles
	}
}
