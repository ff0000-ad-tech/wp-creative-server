export const UPDATE = 'APP-META-UPDATE'

export function update(app) {
	return {
		type: UPDATE,
		app
	}
}
