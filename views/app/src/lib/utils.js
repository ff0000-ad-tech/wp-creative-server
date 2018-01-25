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
