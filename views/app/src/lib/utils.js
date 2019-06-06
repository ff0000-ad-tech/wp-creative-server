import { DEBUG_FOLDER } from 'Root/lib/utils.js'
import { TRAFFIC_FOLDER } from 'Root/lib/utils.js'

import debug from '@ff0000-ad-tech/debug'
const log = debug('wp-cs:app:utils')

export function xhr(url, err, callback) {
	var request = new XMLHttpRequest()
	request.onreadystatechange = function() {
		if (request.readyState === 4) {
			if (request.status !== 200) {
				if (err) err(request.statusText)
			} else {
				if (callback) callback(request.responseText)
			}
		}
	}
	request.open('GET', url)
	request.send()
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
	return `/${context + size + name}/${getLocationQueryStr()}`
}

// would use window.location.search to easily get query string
// but that property isn't supported in IE :/
export function getLocationQueryStr() {
	// look for query string on current window location
	const queryStrMatch = /[^\?]+(\?.*)?/.exec(window.location.href)
	return (queryStrMatch && queryStrMatch[1]) || ''
}
