export const UPDATE = 'UPDATE'


export function update(targets) {
	return {
		type: UPDATE,
		targets
	}
}