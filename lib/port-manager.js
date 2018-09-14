const getPort = require('get-port')

function getNextAvailable(reqPort) {
	return new Promise((resolve, reject) => {
		getPort({ port: reqPort })
			.then(port => confirm(reqPort, port))
			.then(port => resolve(port))
			.catch(err => reject(err))
	})
}

function confirm(reqPort, port) {
	if (reqPort !== port) {
		return getPort({ port: reqPort + 1 })
	} else {
		return Promise.resolve(reqPort)
	}
}

module.exports = { getNextAvailable }
