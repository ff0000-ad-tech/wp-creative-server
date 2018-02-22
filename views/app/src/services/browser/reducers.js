import { ORIGIN, APP_PATH, ROUTE } from './actions.js'

import debug from 'debug'
const log = debug('wp-cs:app:services:reducers:browser')

export function browser(state = {}, action) {
	// domain, like http://10.0.7.126:5200/
	const origin = location.origin
	// app route like: "app", "app/", "app#/"
	const appPath = location.href.slice(origin.length).match(/^\/[^\/]*/)[0]
	// browse route like: "build/300x250"
	const route = location.href.slice((origin + appPath).length)

	// a flag to control whether route updates should redraw the iframe
	// this allows for the iframe to set its own source without causing a redraw once CS finds out about it.
	const renderIframe = false

	state = {
		origin,
		appPath,
		route,
		renderIframe
	}

	switch (action.type) {
		case ORIGIN:
			state.origin = action.url
			return state

		case APP_PATH:
			state.appPath = action.subpath
			return state

		case ROUTE:
			state.route = action.subpath
			state.renderIframe = action.renderIframe
			return state

		default:
			return state
	}
}
