import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import Rpc from '../../../../../../lib/rpc.js'

import './style.scss'

import debug from 'debug'
const log = debug('wp-cs:app:TrafficButton')

import processingGif from '../../images/preloader.gif'
import errorIcon from '../../images/error.png'
import webpackLogo from './images/webpack.svg'

class TrafficButton extends PureComponent {
	constructor(props) {
		super(props)
		this.rpc = new Rpc()
		this.state = {
			showCopiedDialog: false
		}
	}
	updateCheckbox() {
		if (!this.props.profilesSorted.length) {
			return
		}
		const targets = this.props.profiles[this.props.selectedProfile].targets
		for (var i = 0; i < targets.length; i++) {
			if (targets[i].size === this.props.ad.size && targets[i].index === this.props.ad.index) {
				this.checkbox.checked = true
				return
			}
		}
		this.checkbox.checked = false
	}
	onChecked = e => {
		if (e.target.checked) {
			this.rpc.addDeployTargets(this.props.selectedProfile, this.props.ad)
		} else {
			this.rpc.removeDeployTargets(this.props.selectedProfile, this.props.ad)
		}
	}

	// copy command to clipboard
	webpackOnClick = e => {
		this.setState({
			showCopiedDialog: true
		})
		setTimeout(() => {
			this.setState({
				showCopiedDialog: false
			})
		}, 700)
	}

	// run deploy
	onDeployRequest = e => {
		this.rpc.addDeployTargets(this.props.selectedProfile, this.props.ad)
		log('TODO: start parallel-webpack process')
	}

	componentDidMount() {
		this.updateCheckbox()
	}
	componentDidUpdate() {
		this.updateCheckbox()
	}

	render() {
		return (
			<div className="clear-after">
				<div className="traffic-icons clear-after">
					{this.getWebpackLogo()}
					{this.getStateIcon()}
				</div>
				<div className="updated">{this.props.ad.deployAt}</div>
				<div className="checkbox">
					<input
						ref={checkbox => {
							this.checkbox = checkbox
						}}
						type="checkbox"
						onChange={this.onChecked}
					/>
				</div>
			</div>
		)
	}
	getWebpackLogo() {
		const dialog = this.state.showCopiedDialog ? 'show' : ''
		return (
			<div className="webpack" title="Copy deploy command to clipboard">
				<div onClick={this.webpackOnClick}>
					<CopyToClipboard text={this.props.ad.webpack.shell} onCopy={() => {}}>
						<img src={webpackLogo} width="21" height="21" />
					</CopyToClipboard>
				</div>
				<div className={`action-dialog ${dialog}`}>Copied!</div>
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
			<div className="not-watching" onClick={this.onDeployRequest} title="Start Deploy">
				<div className="icon" />
			</div>
		)
	}
	getProcessing() {
		return (
			<div className="processing" title="Deploying...">
				<div className="icon">
					<img src={processingGif} width="14" height="14" />
				</div>
			</div>
		)
	}
	getError() {
		return (
			<div className="error" title="Deploy process errored">
				<img src={errorIcon} width="16" height="16" />
			</div>
		)
	}
}

/* -- Data/State ----
 *
 * 
 */
TrafficButton.propTypes = {
	selectedProfile: PropTypes.string.isRequired,
	ad: PropTypes.object.isRequired
}

const mapStateToProps = function(state) {
	return {
		profiles: state.profiles,
		profilesSorted: state.profilesSorted
	}
}
export default connect(mapStateToProps)(TrafficButton)
