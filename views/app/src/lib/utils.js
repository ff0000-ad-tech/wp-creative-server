import { DEBUG_FOLDER } from 'Root/lib/utils.js'
import { TRAFFIC_FOLDER } from 'Root/lib/utils.js'

import debug from 'debug'
const log = debug('wp-cs:app:utils')

export function xhr(url, callback) {
	var request = new XMLHttpRequest()
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			if (callback) {
				callback(request.responseText)
			}
		}
	}
	request.open('GET', url)
	request.send()
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

// same as "prepareSourceName" -> https://github.com/ff0000-ad-tech/wp-deploy-manager/blob/master/lib/deploy/deploy.js#L15
export function getSourceName(index) {
	const noExt = index.split('.')[0]
	return noExt.replace(/[\s\-_]*index[\s\-_]*/, '')
}

// same as "prepareOutputPaths" -> https://github.com/ff0000-ad-tech/wp-deploy-manager/blob/master/lib/deploy/deploy.js#L25
export function getOutputRoute(size, index, profile) {
	let name = getSourceName(index)
	let context
	if (!profile) {
		context = `${DEBUG_FOLDER}/`
	} else {
		context = `${TRAFFIC_FOLDER}/${profile}/`
	}
	if (name !== '') {
		name = `__${name}`
	}
	return `/${context + size + name}/`
}
