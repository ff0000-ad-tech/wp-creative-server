export const UPDATE = 'TARGETS-UPDATE'

export function update(targets) {
	return {
		type: UPDATE,
		targets
	}
}
