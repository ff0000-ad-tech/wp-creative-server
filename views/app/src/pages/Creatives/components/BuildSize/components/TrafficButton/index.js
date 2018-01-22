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
import traffickedIcon from './images/trafficked.png'

class TrafficButton extends PureComponent {
	constructor(props) {
		super(props)
		this.rpc = new Rpc()
		this.state = {
			showCopiedDialog: false
		}
	}
	// events
	updateCheckbox() {
		if (!this.props.profilesSorted.length) {
			return
		}
		const targets = this.props.currentProfile.profile.targets
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
			this.rpc.addDeployTargets(this.props.currentProfile.name, this.props.ad)
		} else {
			this.rpc.removeDeployTargets(this.props.currentProfile.name, this.props.ad)
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
		this.rpc.addDeployTargets(this.props.currentProfile.name, this.props.ad)
		log('TODO: start parallel-webpack process')
	}

	componentDidMount() {
		this.updateCheckbox()
	}
	componentDidUpdate() {
		this.updateCheckbox()
	}

	render() {
		// determine this profile target
		this.profileTarget = {}
		if (this.props.currentProfile.profile.targets) {
			this.profileTarget = this.props.currentProfile.profile.targets.filter(target => {
				if (target.index === this.props.ad.index) {
					return true
				}
			})[0]
		}

		// render
		return (
			<div className="clear-after">
				<div className="traffic-icons clear-after">
					{this.getWebpackLogo()}
					{this.getStateIcon()}
				</div>
				<div className="updated">{this.profileTarget.deployAt || ''}</div>
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
					<CopyToClipboard text={this.props.ad.traffic.cmd.shell} onCopy={() => {}}>
						<img src={webpackLogo} width="21" height="21" />
					</CopyToClipboard>
				</div>
				<div className={`action-dialog ${dialog}`}>Copied!</div>
			</div>
		)
	}
	getStateIcon() {
		if (this.props.ad.traffic.error) {
			return this.getError()
		} else if (this.props.ad.traffic.processing) {
			return this.getProcessing()
		} else if (this.profileTarget.deployAt) {
			return this.getHasDeployed()
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
	getHasDeployed() {
		return (
			<div className="has-deployed" title="Deploy process successful">
				<img src={traffickedIcon} width="16" height="16" />
			</div>
		)
	}
}

/* -- Data/State ----
 *
 * 
 */
TrafficButton.propTypes = {
	currentProfile: PropTypes.object.isRequired,
	ad: PropTypes.object.isRequired
}

const mapStateToProps = function(state) {
	return {
		profiles: state.profiles,
		profilesSorted: state.profilesSorted
	}
}
export default connect(mapStateToProps)(TrafficButton)
