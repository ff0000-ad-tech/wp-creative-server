import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'

import Rpc from '../../../../../../../../lib/rpc.js'
import { xhr } from '../../../../../../../../lib/utils.js'
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
		this.rpc.addDeployTargets(this.props.currentProfile.name, this.props.ad)
		this.rpc.copyWpCmd(this.props.currentProfile.name, this.props.ad.size, this.props.ad.index, err => {
			alert(err)
		})
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
	startCompiling = e => {
		this.rpc.addDeployTargets(this.props.currentProfile.name, this.props.ad)
		if (!this.props.ad.watching.debug.processing && !this.props.ad.watching.debug.watching) {
			xhr(`/api/compile-start/${this.props.currentProfile.name}/${this.props.ad.size}/${this.props.ad.index}`)
		}
	}
	stopCompiling = e => {
		xhr(`/api/compile-stop/${this.props.currentProfile.name}/${this.props.ad.size}/${this.props.ad.index}`)
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
		const profileTargets = this.props.currentProfile.profile.targets.filter(target => {
			if (target.size === this.props.ad.size && target.index === this.props.ad.index) {
				return true
			}
		})
		if (profileTargets.length) {
			this.profileTarget = profileTargets[0]
		}

		// render
		return (
			<div className="clear-after">
				<div className="traffic-icons clear-after">
					{this.getWebpackLogo()}
					{this.getStateIcon()}
				</div>
				<div className="updated">{this.profileTarget.deployAt ? moment(this.profileTarget.deployAt).from(Date.now()) : ''}</div>
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
					<img src={webpackLogo} width="21" height="21" />
				</div>
				<div className={`action-dialog ${dialog}`}>Copied!</div>
			</div>
		)
	}
	getStateIcon() {
		if (this.props.ad.watching[this.props.currentProfile].error) {
			return this.getError()
		} else if (this.props.ad.watching[this.props.currentProfile].watching || this.props.ad.watching[this.props.currentProfile].processing) {
			return this.getProcessing()
		} else if (this.profileTarget.deployAt) {
			return this.getHasDeployed()
		} else {
			return this.getNotProcessing()
		}
	}
	getNotProcessing() {
		return (
			<div className="not-watching" title="Start Deploy" onClick={this.startCompiling}>
				<div className="icon" />
			</div>
		)
	}
	getProcessing() {
		return (
			<div className="processing" title="Deploying..." onClick={this.stopCompiling}>
				<div className="icon">
					<img src={processingGif} width="14" height="14" />
				</div>
			</div>
		)
	}
	getError() {
		return (
			<div className="error" title="Deploy errored - run command in Terminal for more info">
				<img src={errorIcon} width="16" height="16" />
			</div>
		)
	}
	getHasDeployed() {
		return (
			<div className="has-deployed" title="Rerun Deploy" onClick={this.startCompiling}>
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
	ad: PropTypes.object.isRequired
}

const mapStateToProps = function(state) {
	return {
		profiles: state.profiles,
		currentProfile: state.currentProfile
	}
}
export default connect(mapStateToProps)(TrafficButton)
