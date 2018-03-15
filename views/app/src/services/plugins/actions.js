export const UPDATE = 'PLUGINS-UPDATE'

export function update(plugins) {
	return {
		type: UPDATE,
		plugins
	}
}
