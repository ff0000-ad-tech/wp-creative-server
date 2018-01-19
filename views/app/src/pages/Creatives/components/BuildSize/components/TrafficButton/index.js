import React, { PureComponent } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import './style.scss'

import debug from 'debug'
const log = debug('wp-cs:app:TrafficButton')

import processingGif from '../../images/preloader.gif'
import errorIcon from '../../images/error.png'
import webpackLogo from './images/webpack.svg'

class TrafficButton extends PureComponent {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className="clear-after">
				<div className="traffic-icons clear-after">
					{this.getWebpackLogo()}
					{this.getStateIcon()}
				</div>
				<div className="updated">deployed 2 days ago</div>
				<div className="checkbox">
					<input type="checkbox" />
				</div>
			</div>
		)
	}

	getWebpackLogo() {
		return (
			<div className="webpack">
				<img src={webpackLogo} width="21" height="21" />
			</div>
		)
	}

	getStateIcon() {
		if (this.props.ad.error) {
			return this.getError()
		} else if (this.props.ad.processing) {
			return this.getProcessing()
		} else {
			return this.getNotProcessing()
		}
	}
	getNotProcessing() {
		return (
			<div className="not-watching">
				<div className="icon" />
			</div>
		)
	}
	getProcessing() {
		return (
			<div className="processing">
				<div className="icon">
					<img src={processingGif} width="14" height="14" />
				</div>
			</div>
		)
	}
	getError() {
		return (
			<div className="error">
				<img src={errorIcon} width="16" height="16" />
			</div>
		)
	}
}

export default TrafficButton
