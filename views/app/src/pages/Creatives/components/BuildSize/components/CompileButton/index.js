import React, { PureComponent } from 'react'
import './style.scss'

import debug from 'debug'
const log = debug('wp-cs:app:CompileButton')

import * as processingGif from './images/preloader.gif'

class CompileButton extends PureComponent {
	constructor(props) {
		super(props)
	}

	render() {
		if (this.props.ad.watching) {
			return this.getWatching()
		} else if (this.props.ad.processing) {
			return this.getProcessing()
		} else {
			return this.getNotWatching()
		}
	}

	getNotWatching() {
		return (
			<a href={`/api/start-watching?size=${this.props.ad.size}&index=${this.props.ad.index}`}>
				<div className="not-watching" />
			</a>
		)
	}
	getWatching() {
		return (
			<a href={`/api/stop-watching?size=${this.props.ad.size}&index=${this.props.ad.index}`}>
				<div className="watching" />
			</a>
		)
	}
	getProcessing() {
		return <img src={processingGif} width="16" height="16" />
	}
}

export default CompileButton
