import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
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
	}
	updateCheckbox() {
		const targets = this.props.profiles[this.props.selectedProfile].targets
		for (var i = 0; i < targets.length; i++) {
			if (targets[i].size === this.props.ad.size && targets[i].index === this.props.ad.index) {
				this.checkbox.checked = true
				return
			}
		}
		this.checkbox.checked = false
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
				<div className="updated">deployed 2 days ago</div>
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

	onChecked = e => {
		if (e.target.checked) {
			this.rpc.addDeployTarget(this.props.selectedProfile, this.props.ad)
		} else {
			this.rpc.removeDeployTarget(this.props.selectedProfile, this.props.ad)
		}
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
		sorted: state.sorted
	}
}
export default connect(mapStateToProps)(TrafficButton)
