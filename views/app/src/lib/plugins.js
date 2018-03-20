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

// plugin pathing utilities
export function getPluginSettings(plugins, plugin) {
	if ('wp-creative-server' in plugins.installed[plugin]) {
		return plugins.installed[plugin]['wp-creative-server']
	}
}
export function hasHook(settings, hook) {
	return 'hooks' in settings && hook in settings.hooks
}

// appends an additional query-string to a plugin-route
export function getPluginRequest(plugin, route, args) {
	const p = getPluginRoute(route)
	const query = p.query ? `?${p.query}&` : `?`
	let qs = ''
	if (args) {
		Object.keys(args).forEach(arg => {
			let value = args[arg]
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
	return {
		route: parts[0].replace(/\/$/, ''), // no trailing slash
		query: parts.length > 1 ? encodeURIComponent(parts[1]) : null
	}
}
