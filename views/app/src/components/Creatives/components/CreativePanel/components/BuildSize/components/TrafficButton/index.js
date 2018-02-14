import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'

import Rpc from '../../../../../../../../lib/rpc.js'
import {xhr} from '../../../../../../../../lib/utils.js'
import {updateWatch} from '../../../../../../../../services/targets/actions.js'
import {updateDeployAt} from '../../../../../../../../services/profiles/actions.js'

import './style.scss'

import debug from 'debug'
const log = debug('wp-cs:app:TrafficButton')

import processingGif from '../../images/preloader.gif'
import errorIcon from '../../images/error.png'
import webpackLogo from './images/webpack.svg'
import traffickedIcon from './images/trafficked.png'
import arrowIcon from './images/arrow-right.svg'

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
		this.rpc.copyWpCmd(this.props.currentProfile.name, this.props.ad.size, this.props.ad.index, () => {
			this.setState({
				showCopiedDialog: true
			})
			setTimeout(() => {
				this.setState({
					showCopiedDialog: false
				})
			}, 700)
		})
	}

	// run deploy
	startCompiling = e => {
		if (this.props.ad.watching.debug.processing || this.props.ad.watching.debug.watching) {
			return
		}
		this.rpc.addDeployTargets(this.props.currentProfile.name, this.props.ad)
		this.props.dispatch(
			updateWatch(this.props.currentProfile.name, this.props.ad.size, this.props.ad.index, {
				processing: true
			})
		)
		this.props.dispatch(
			updateDeployAt(this.props.currentProfile.name, this.props.ad.size, this.props.ad.index, {
				deployAt: '...'
			})
		)
		xhr(`/api/compile-start/${this.props.currentProfile.name}/${this.props.ad.size}/${this.props.ad.index}`)
	}
	stopCompiling = e => {
		xhr(`/api/compile-stop/${this.props.currentProfile.name}/${this.props.ad.size}/${this.props.ad.index}`)
	}

	gotoTrafficSizeIndex = () => {
		location.href = `/app/3-traffic/${this.props.currentProfile.name}/${this.props.ad.size}/${this.props.ad.index}`
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
				<div>{this.getUpdatedMsg()}</div>
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
		if (!(this.props.currentProfile.name in this.props.ad.watching)) {
			return
		}
		if (this.props.ad.watching[this.props.currentProfile.name].error) {
			return this.getError()
		} else if (
			this.props.ad.watching[this.props.currentProfile.name].watching ||
			this.props.ad.watching[this.props.currentProfile.name].processing
		) {
			return this.getProcessing()
		} else if (this.profileTarget.deployAt) {
			return this.getHasDeployed()
		} else {
			return this.getNotProcessing()
		}
	}
	getUpdatedMsg() {
		// deploy message
		let deployAtMessage = this.profileTarget.deployAt || ''
		if (Number.isInteger(this.profileTarget.deployAt)) {
			deployAtMessage = moment(this.profileTarget.deployAt).from(Date.now())
		}
		if (deployAtMessage === '' || deployAtMessage === '...') {
			return
		}
		return (
			<div className="updated-container clear-after" onClick={this.gotoTrafficSizeIndex} title="Preview this traffic index">
				<div className="updated">{deployAtMessage}</div>
				<div className="arrow-icon">
					<img src={arrowIcon} width="12" height="12" />
				</div>
			</div>
		)
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
