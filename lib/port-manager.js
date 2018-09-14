const tcpPortUsed = require('tcp-port-used')

function getNextAvailable(port) {
	return new Promise((resolve, reject) => {
		tcpPortUsed(port)
			.then(isUsed => confirm(port, isUsed))
			.then(port => resolve(port))
			.catch(err => reject(err))
	})
}

function confirm(port, isUsed) {
	if (isUsed) {
		const nextPort = port + 1
		return tcpPortUsed(nextPort).then(isUsed => confirm(isUsed, nextPort))
	} else {
		return Promise.resolve(port)
	}
}

module.exports = { getNextAvailable }
