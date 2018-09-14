const debug = require('@ff0000-ad-tech/debug')
var log = debug('wp-creative-server:port-manager')

const MAX_PORTS = 5
let portCount = 0

function getNextAvailable(app, ip, port) {
	portCount = 0
	return new Promise((resolve, reject) => {
		tryPort(app, ip, port)
			.then(isAvailable => {
				return confirm(app, ip, port, isAvailable)
			})
			.then(port => resolve(port))
			.catch(err => reject(err))
	})
}

function confirm(app, ip, port, isAvailable) {
	if (portCount >= MAX_PORTS) {
		return Promise.reject(new Error(`Maximum number (${MAX_PORTS}) of Creative Servers are already running!`))
	}
	if (!isAvailable) {
		portCount++
		const nextPort = port + 1
		return tryPort(app, ip, nextPort).then(isAvailable => confirm(app, ip, nextPort, isAvailable))
	} else {
		return Promise.resolve(port)
	}
}

function tryPort(app, ip, port) {
	return new Promise((resolve, reject) => {
		const server = app
			.listen(port, ip, () => {
				server.close()
				resolve(true)
			})
			.on('error', err => {
				resolve(false)
			})
	})
}

module.exports = { getNextAvailable }
