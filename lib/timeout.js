const debug = require('@ff0000-ad-tech/debug')
const log = debug('wp-creative-server:timeout')

let interval, timeoutCallback, timeoutId

const setCsTimeout = (seconds, cb) => {
	if (seconds <= 0) {
		log(`'timeout' argument, ${seconds}, must be greater than zero.`)
		return
	}
	interval = seconds * 1000
	timeoutCallback = cb
	resetCsTimeout()
}

const clearCsTimeout = () => {
	clearTimeout(timeoutId)
}

const resetCsTimeout = () => {
	if (!interval && !timeoutCallback) {
		return
	}
	clearCsTimeout()
	timeoutId = setTimeout(timeoutCallback, interval)
}

module.exports = {
	setCsTimeout,
	clearCsTimeout,
	resetCsTimeout
}
