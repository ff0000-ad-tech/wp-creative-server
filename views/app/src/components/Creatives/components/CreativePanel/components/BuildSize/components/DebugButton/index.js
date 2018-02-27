import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Rpc from 'AppSrc/lib/rpc.js'
import { DEBUG_FOLDER } from 'Root/lib/utils.js'
import { xhr } from 'AppSrc/lib/utils.js'
import { updateWatch } from 'AppSrc/services/targets/actions.js'
import { route } from 'AppSrc/services/browser/actions.js'

import './style.scss'

import debug from 'debug'
const log = debug('wp-cs:app:DebugButton')

import processingGif from '../../images/preloader.gif'
import errorIcon from '../../images/error.png'
import shellIcon from './images/shell.png'
import viewIcon from '../../images/view-icon.svg'

class DebugButton extends PureComponent {
	constructor(props) {
		super(props)
		this.rpc = new Rpc()
		this.state = {
			showTerminalWatchDialog: false
		}
	}

	terminalWatchOnClick = e => {
		// only one debug compile is tracked, regardless of selected profile
		this.rpc.copyWpCmd('debug', this.props.ad.size, this.props.ad.index, () => {
			this.setState({
				showTerminalWatchDialog: true
			})
			setTimeout(() => {
				this.setState({
					showTerminalWatchDialog: false
				})
			}, 700)
		})
	}

	startCompiling = () => {
		if (this.props.ad.watching.debug.processing || this.props.ad.watching.debug.watching) {
			return
		}
		this.props.dispatch(
			updateWatch('debug', this.props.ad.size, this.props.ad.index, {
				processing: true
			})
		)
		xhr(`/api/compile-start/debug/${this.props.ad.size}/${this.props.ad.index}`)
	}
	stopCompiling = () => {
		this.props.dispatch(
			updateWatch('debug', this.props.ad.size, this.props.ad.index, {
				processing: true
			})
		)
		xhr(`/api/compile-stop/debug/${this.props.ad.size}/${this.props.ad.index}`)
	}

	gotoDebugSizeIndex = () => {
		this.props.dispatch(route(`/${DEBUG_FOLDER}/${this.props.ad.size}/${this.props.ad.index}/`))
	}

	render() {
		if (this.props.ad.watching.debug.error) {
			return this.getError()
		} else if (this.props.ad.watching.debug.processing) {
			return this.getProcessing()
		} else if (this.props.ad.watching.debug.watching) {
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
			<div className="buttons">
				{this.getTerminalWatch()}
				<div className="not-watching" title="Watch process is idle" onClick={this.startCompiling}>
					<div className="icon" />
				</div>
				{this.getViewIcon()}
			</div>
		)
	}

	getWatching() {
		return (
			<div className="buttons">
				{this.getTerminalWatch()}
				<div className="watching" title="Watching..." onClick={this.stopCompiling}>
					<div className="icon" />
				</div>
				{this.getViewIcon()}
			</div>
		)
	}
	getProcessing() {
		return (
			<div className="buttons">
				{this.getTerminalWatch()}
				<div className="processing" title="Processing..." onClick={this.stopCompiling}>
					<div className="icon">
						<img src={processingGif} width="14" height="14" />
					</div>
				</div>
				{this.getViewIcon()}
			</div>
		)
	}
	getError() {
		return (
			<div className="buttons">
				{this.getTerminalWatch()}
				<div className="error" title="Watch process errored - run command in Terminal for more info">
					<img src={errorIcon} width="16" height="16" />
				</div>
				{this.getViewIcon()}
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
					<img src={shellIcon} width="12" height="12" />
				</div>
				<div className={`action-dialog ${dialog}`}>Copied!</div>
			</div>
		)
	}

	getViewIcon() {
		return (
			<div className="view-icon" title="Preview this debug index">
				<div onClick={this.gotoDebugSizeIndex}>
					<img src={viewIcon} width="15" height="15" />
				</div>
			</div>
		)
	}
}

DebugButton.propTypes = {
	ad: PropTypes.object.isRequired
}

const mapStateToProps = function(state) {
	return {
		currentProfile: state.currentProfile
	}
}
export default connect(mapStateToProps)(DebugButton)
