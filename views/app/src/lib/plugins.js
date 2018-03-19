import debug from 'debug'
const log = debug('wp-cs:app:plugins')

/* notes
	*	plugins may "hook" into various points in creative server by defining api callbacks.
	*	each hook will send different inputs to the callback
	*	in this case, a list of selected targets
	*/
export function getPluginControls(hook, plugins) {
	let controls = {}
	// look for plugins that have "bulk-control" hooks
	if (plugins) {
		Object.keys(plugins.installed).forEach(plugin => {
			const settings = getPluginSettings(plugin)
			if (hasHook(settings, hook)) {
				// we expect only one command-per-hook
				controls[plugin] = Object.keys(settings.hooks[hook])[0]
			}
		})
	}
	return controls
}

// plugin pathing utilities
export function getPluginSettings(plugin) {
	if ('wp-creative-server' in this.props.plugins.installed[plugin]) {
		return this.props.plugins.installed[plugin]['wp-creative-server']
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
			qs += `&${arg}=${encodeURIComponent(JSON.stringify(args[arg]))}`
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
		query: parts.length > 1 ? parts[1] : null
	}
}
