export const UPDATE = 'TARGETS-UPDATE'
export function update(targets) {
	return {
		type: UPDATE,
		targets
	}
}

export const UPDATE_WATCH = 'TARGETS-UPDATE-WATCH'
export function updateWatch(profile, size, index, watching) {
	return {
		type: UPDATE_WATCH,
		profile,
		size,
		index,
		watching
	}
}
