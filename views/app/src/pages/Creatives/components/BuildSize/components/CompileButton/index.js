import React, { PureComponent } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import './style.scss'

import debug from 'debug'
const log = debug('wp-cs:app:CompileButton')

import processingGif from './images/preloader.gif'
import errorIcon from './images/error.png'
import shellIcon from './images/shell.png'

class CompileButton extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			showCopiedText: false
		}
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

	/**
	 * NOT WATCHING
	 */
	getNotWatching() {
		const dialog = this.state.showWatchingDialog ? 'show' : ''
		return (
			<div>
				<div style={{ marginTop: '4px' }}>
					<div
						className="not-watching"
						onClick={() => {
							this.notWatchingOnClick()
							this.xhr(`/api/start-watching?size=${this.props.ad.size}&index=${this.props.ad.index}`)
						}}
					>
						<div className="icon" />
					</div>
					{this.getTerminalWatch()}
				</div>
				<div className={`action-dialog ${dialog}`}>Watch process started!</div>
			</div>
		)
	}
	notWatchingOnClick = e => {
		this.setState({
			showWatchingDialog: true
		})
		setTimeout(() => {
			this.setState({
				showWatchingDialog: false
			})
		}, 700)
	}

	getWatching() {
		return (
			<div style={{ marginTop: '4px' }}>
				<div className="watching">
					<div
						className="icon"
						onClick={() => {
							this.xhr(`/api/stop-watching?size=${this.props.ad.size}&index=${this.props.ad.index}`)
						}}
					/>
				</div>
				{this.getTerminalWatch()}
			</div>
		)
	}
	getProcessing() {
		return (
			<div style={{ marginTop: '2px' }}>
				<div className="processing">
					<div className="icon">
						<img src={processingGif} width="14" height="14" />
					</div>
				</div>
				{this.getTerminalWatch()}
			</div>
		)
	}
	getError() {
		return (
			<div className="clear-after">
				<div className="error left">
					<img src={errorIcon} width="16" height="16" />
				</div>
				{this.getTerminalWatch()}
			</div>
		)
	}

	/**
	 * TERMINAL WATCH
	 */
	getTerminalWatch() {
		const dialog = this.state.showTerminalWatchDialog ? 'show' : ''

		return (
			<div className="shell" title="Copy command and run in shell">
				<div onClick={this.terminalWatchOnClick}>
					<CopyToClipboard text={this.props.ad.webpack.shell} onCopy={() => {}}>
						<img src={shellIcon} width="12" height="12" />
					</CopyToClipboard>
				</div>
				<div className={`action-dialog ${dialog}`}>Copied!</div>
			</div>
		)
	}
	terminalWatchOnClick = e => {
		this.setState({
			showTerminalWatchDialog: true
		})
		setTimeout(() => {
			this.setState({
				showTerminalWatchDialog: false
			})
		}, 700)
	}
}

export default CompileButton
