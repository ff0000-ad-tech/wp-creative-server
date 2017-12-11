import React, { PureComponent } from 'react'
import './style.scss'

import debug from 'debug'
const log = debug('wp-cs:app:CompileButton')

import processingGif from './images/preloader.gif'
import errorIcon from './images/error.png'

class CompileButton extends PureComponent {
	constructor(props) {
		super(props)
	}
	xhr(url, callback) {
		log(url)
		callback = callback || function() {}
		var request = new XMLHttpRequest()
		request.onreadystatechange = function() {
			if (request.readyState == 4 && request.status == 200) {
				callback(request.responseText)
			}
		}
		request.open('GET', url)
		request.send()
	}

	render() {
		if (this.props.ad.error) {
			return this.getError()
		} else if (this.props.ad.processing) {
			return this.getProcessing()
		} else if (this.props.ad.watching) {
			return this.getWatching()
		} else {
			return this.getNotWatching()
		}
	}

	getNotWatching() {
		return (
			<div
				className="not-watching"
				onClick={() => {
					this.xhr(`/api/start-watching?size=${this.props.ad.size}&index=${this.props.ad.index}`)
				}}
			/>
		)
	}
	getWatching() {
		return (
			<div
				className="watching"
				onClick={() => {
					this.xhr(`/api/stop-watching?size=${this.props.ad.size}&index=${this.props.ad.index}`)
				}}
			/>
		)
	}
	getProcessing() {
		return <img src={processingGif} width="16" height="16" />
	}
	getError() {
		return (
			<div className="error">
				<img src={errorIcon} width="16" height="16" />
			</div>
		)
	}
}

export default CompileButton
