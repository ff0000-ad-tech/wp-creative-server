import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { xhr } from '../../../../../../../../lib/utils.js'
import './style.scss'

import debug from 'debug'
const log = debug('wp-cs:app:DebugButton')

import processingGif from '../../images/preloader.gif'
import errorIcon from '../../images/error.png'
import shellIcon from './images/shell.png'

class DebugButton extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			showTerminalWatchDialog: false
		}
	}

	startCompiling = () => {
		if (!this.props.ad.debug.processing && !this.props.ad.debug.watching) {
			xhr(`/api/compile-start/${this.props.ad.size}/${this.props.ad.index}/debug`)
		}
	}
	stopCompiling = () => {
		xhr(`/api/compile-stop/${this.props.ad.size}/${this.props.ad.index}/debug`)
	}

	render() {
		if (this.props.ad.debug.error) {
			return this.getError()
		} else if (this.props.ad.debug.processing) {
			return this.getProcessing()
		} else if (this.props.ad.debug.watching) {
			return this.getWatching()
		} else {
			return this.getNotWatching()
		}
	}

	/**
	 * NOT WATCHING
	 */
	getNotWatching() {
		return (
			<div>
				<div style={{ marginTop: '4px' }}>
					{this.getTerminalWatch()}
					<div className="not-watching" title="Watch process is idle" onClick={this.startCompiling}>
						<div className="icon" />
					</div>
				</div>
			</div>
		)
	}

	getWatching() {
		return (
			<div style={{ marginTop: '4px' }}>
				{this.getTerminalWatch()}
				<div className="watching" title="Watching..." onClick={this.stopCompiling}>
					<div className="icon" />
				</div>
			</div>
		)
	}
	getProcessing() {
		return (
			<div style={{ marginTop: '2px' }}>
				{this.getTerminalWatch()}
				<div className="processing" title="Processing..." onClick={this.stopCompiling}>
					<div className="icon">
						<img src={processingGif} width="14" height="14" />
					</div>
				</div>
			</div>
		)
	}
	getError() {
		return (
			<div className="clear-after">
				{this.getTerminalWatch()}
				<div className="error" title="Watch process errored">
					<img src={errorIcon} width="16" height="16" />
				</div>
			</div>
		)
	}

	/**
	 * TERMINAL WATCH
	 */
	getTerminalWatch() {
		const dialog = this.state.showTerminalWatchDialog ? 'show' : ''

		return (
			<div className="shell" title="Copy watch command to clipboard">
				<div onClick={this.terminalWatchOnClick}>
					<CopyToClipboard text={this.props.ad.debug.cmd.shell} onCopy={() => {}}>
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

DebugButton.propTypes = {
	currentProfile: PropTypes.object.isRequired,
	ad: PropTypes.object.isRequired
}

export default DebugButton
