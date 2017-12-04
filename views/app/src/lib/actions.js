export const UPDATE_TARGETS = 'UPDATE_TARGETS'


export function updateTargets(targets) {
	return {
		type: UPDATE_TARGETS,
		targets
	}
}