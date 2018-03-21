import { BUILD_FOLDER } from 'Root/lib/utils.js'
import { DEBUG_FOLDER } from 'Root/lib/utils.js'
import { TRAFFIC_FOLDER } from 'Root/lib/utils.js'

import debug from 'debug'
const log = debug('wp-cs:app:plugins')

/* notes
	*	plugins may "hook" into various points in creative server by defining api callbacks.
	*	each hook will send different inputs to the callback
	*	in this case, a list of selected targets
	*/
export function getPluginControls(plugins, hook) {
	if (!plugins) {
		return
	}
	// look for plugins that have the requested hook
	let controls = {}
	Object.keys(plugins.installed).forEach(plugin => {
		const settings = getPluginSettings(plugins, plugin)
		if (hasHook(settings, hook)) {
			// we expect only one command-per-hook
			controls[plugin] = Object.keys(settings.hooks[hook])[0]
		}
	})
	if (!Object.keys(controls).length) {
		return
	}
	return controls
}

// returns a plugin's wp-creative-server related settings object
export function getPluginSettings(plugins, plugin) {
	if ('wp-creative-server' in plugins.installed[plugin]) {
		return plugins.installed[plugin]['wp-creative-server']
	}
}
export function hasHook(settings, hook) {
	return 'hooks' in settings && hook in settings.hooks
}

// appends an additional query-string to a plugin-route
// NOTE: default arguments are appended by ./routes/plugins
export function getPluginRequest(plugin, route, args) {
	const p = getPluginRoute(route)
	const query = p.query ? `?${p.query}&` : `?`
	let qs = ''
	if (args) {
		Object.keys(args).forEach(arg => {
			let value = args[arg]
			// serialize arg values that are objects
			if (typeof value === 'object') {
				value = JSON.stringify(value)
			}
			qs += `&${arg}=${encodeURIComponent(value)}`
		})
		qs = qs.slice(1)
	}
	return `/${plugin}${p.route}/${query}${qs}`
}

// prepares a plugin's declared route (which may contain hard-coded query-string params)
function getPluginRoute(str) {
	const parts = str.split('?')
	const route = parts[0].replace(/\/$/, '') // no trailing slash
	let query
	if (parts.length > 1) {
		let args = parts[1].split('&')
		args = args.map(arg => {
			const keyVal = arg.split('=')
			return `${encodeURIComponent(keyVal[0])}=${encodeURIComponent(keyVal[1])}`
		})
		query = args.join('&')
	}
	return {
		route,
		query
	}
}
