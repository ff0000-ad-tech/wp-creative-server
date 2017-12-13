const os = require('os')
const debug = require('debug')
var log = debug('wp-creative-server:network')

// check list of network interfaces that match "en" and are "IPv4"
function getIp() {
	const netifaces = os.networkInterfaces()
	const ids = Object.keys(netifaces).filter(id => {
		return id.indexOf('en') === 0
	})
	for (var i in ids) {
		const addresses = netifaces[ids[i]].filter(type => {
			return type.family == 'IPv4'
		})
		// take the first one we find
		if (addresses) {
			return addresses[0].address
		}
	}
	return 'localhost'
}

module.exports = {
	getIp
}
