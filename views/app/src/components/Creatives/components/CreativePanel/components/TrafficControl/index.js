import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Rpc from '../../../../../../lib/rpc.js'

import debug from 'debug'
const log = debug('wp-cs:app:TrafficControl')

import SettingsEditor from './components/SettingsEditor'

import './style.scss'
import settingsIcon from './images/settings-icon.svg'

class TrafficControl extends PureComponent {
	constructor(props) {
		super(props)
		this.rpc = new Rpc()
		this.state = {
			isDefiningProfile: false,
			showEditor: false
		}
	}
	componentDidMount() {
		this.updateCheckbox()
	}
	componentDidUpdate() {
		this.updateCheckbox()
		if (this.profileInput) {
			this.profileInput.focus()
		}
	}

	/* -- Manage Profile Control ----
	 *
	 * 
	 */
	getProfileControl() {
		if (!this.state.isDefiningProfile) {
			return this.getProfileSelect()
		} else {
			return this.getProfileInput()
		}
	}
	toggleProfileControl = () => {
		this.setState({
			isDefiningProfile: !this.state.isDefiningProfile
		})
	}
	handleKeyPress = e => {
		if (e.key === 'Enter') {
			e.target.blur()
			this.createNewProfile(this.profileInput.value)
		}
	}
	updateCheckbox() {
		if (!Object.keys(this.props.targets).length) {
			this.checkbox.checked = false
			return
		}
		// check available targets
		for (var key in this.props.targets) {
			const target = this.props.targets[key]
			// check if selected-profile has available target
			let isSelected = false
			const profileTargets = this.props.currentProfile.profile.targets
			for (var i = 0; i < profileTargets.length; i++) {
				if (profileTargets[i].size === target.size && profileTargets[i].index === target.index) {
					isSelected = true
					break
				}
			}
			if (!isSelected) {
				this.checkbox.checked = false
				return
			}
		}
		this.checkbox.checked = true
	}

	// profile api
	createNewProfile(name) {
		this.rpc.newProfile(name)
		this.toggleProfileControl()
		this.checkbox.checked = false
	}
	updateProfile = json => {
		this.rpc.updateProfile(this.profileSelect.value, json)
		this.hideEditor()
	}
	deleteProfile = () => {
		this.rpc.deleteProfile(this.profileSelect.value)
		this.hideEditor()
	}
	selectProfile = e => {
		this.rpc.updateProfile(this.profileSelect.value, this.props.profiles[this.profileSelect.value])
	}

	// select/deselect all targets
	onChecked = e => {
		if (e.target.checked) {
			this.rpc.addDeployTargets(this.props.currentProfile.name, this.getAllTargetsAsList())
		} else {
			this.rpc.removeDeployTargets(this.props.currentProfile.name, this.getAllTargetsAsList())
		}
	}
	getAllTargetsAsList() {
		return Object.keys(this.props.targets).map(key => {
			return this.props.targets[key]
		})
	}

	/* -- Editor Control ----
	 *
	 * 
	 */
	showEditor = () => {
		this.setState({
			showEditor: true
		})
	}
	hideEditor = () => {
		this.setState({
			showEditor: false
		})
	}

	/* -- Render ----
	 *
	 * 
	 */
	// profile select
	getProfileSelect() {
		let profiles = [this.props.currentProfile]
		Object.keys(this.props.profiles).forEach(name => {
			if (name === this.props.currentProfile.name) {
				return
			}
			profiles.push({
				name: name,
				profile: this.props.profiles[name]
			})
		})

		return (
			<select
				ref={select => {
					this.profileSelect = select
				}}
				value={this.props.currentProfile.name}
				onChange={this.selectProfile}
			>
				{profiles.map(profile => {
					return (
						<option key={profile.name} value={profile.name}>
							{profile.name}
						</option>
					)
				})}
			</select>
		)
	}

	// profile input
	getProfileInput() {
		return (
			<input
				className="input-profile"
				ref={input => {
					this.profileInput = input
				}}
				onKeyPress={this.handleKeyPress}
				type="text"
			/>
		)
	}

	// render
	render() {
		return (
			<div>
				<div className="traffic-control-options">
					<li className="build-col col" />
					<li className="debug-col col" />
					<li className="settings-col col">
						<div className="settings clear-after">
							<div className="right clear-after">
								<div className="option-checkbox right">
									<input
										ref={checkbox => {
											this.checkbox = checkbox
										}}
										type="checkbox"
										onChange={this.onChecked}
									/>
								</div>
								<div className="option-button right">
									<input type="button" value="DEPLOY" />
								</div>
							</div>

							<div className="left clear-after">
								<div className="option-button left" style={{ paddingLeft: '0px' }}>
									<input type="button" value="+" onClick={this.toggleProfileControl} />
								</div>
								<div className="option-button left">{this.getProfileControl()}</div>
								<div className="option-button left">
									<div style={{ paddingTop: '2px' }} onClick={this.showEditor}>
										<img src={settingsIcon} width="16" height="16" />
									</div>
								</div>
							</div>
						</div>
					</li>
				</div>
				<SettingsEditor
					onSave={this.updateProfile}
					onClose={this.hideEditor}
					onDelete={this.deleteProfile}
					show={this.state.showEditor}
					currentProfile={this.props.currentProfile}
				/>
			</div>
		)
	}
}

/* -- Data/State ----
	*
	* 
	*/
const mapStateToProps = function(state) {
	return {
		targets: state.targets,
		profiles: state.profiles,
		currentProfile: state.currentProfile
	}
}
export default connect(mapStateToProps)(TrafficControl)
