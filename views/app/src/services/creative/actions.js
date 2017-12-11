export const UPDATE = 'CREATIVE-UPDATE'

export function update(creative) {
	return {
		type: UPDATE,
		creative
	}
}
