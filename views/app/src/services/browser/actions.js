export const ORIGIN = 'ORIGIN'
export function origin(url) {
	return {
		type: ORIGIN,
		url
	}
}

export const APP_PATH = 'APP_PATH'
export function appPath(subpath) {
	return {
		type: APP_PATH,
		subpath
	}
}

export const ROUTE = 'ROUTE'
export function route(subpath, renderIframe = true) {
	return {
		type: ROUTE,
		subpath,
		renderIframe
	}
}
