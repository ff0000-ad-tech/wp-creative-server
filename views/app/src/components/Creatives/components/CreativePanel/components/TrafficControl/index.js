import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Backend from 'AppSrc/lib/backend.js'
import { addProfile } from 'AppSrc/services/profiles/actions.js'

import debug from '@ff0000-ad-tech/debug'
const log = debug('wp-cs:app:TrafficControl')

import SettingsEditor from './components/SettingsEditor'
import BulkControl from './components/BulkControl'

import './style.scss'
import settingsIcon from './images/settings-icon.svg'

class TrafficControl extends PureComponent {
	constructor(props) {
		super(props)
		this.backend = new Backend()
		this.state = {
			isDefiningProfile: false,
			showEditor: false
		}
	}

	/* -- Manage Profile Control ----
	 *
	 * 
	 */
	showProfileInput = () => {
		this.setState({
			isDefiningProfile: true
		})
	}
	hideProfileInput = () => {
		this.setState({
			isDefiningProfile: false
		})
	}
	handleKeyPress = e => {
		if (e.key === 'Enter') {
			e.target.blur()
			this.createNewProfile(this.profileInput.value)
		}
	}

	// profile api
	createNewProfile(name) {
		this.hideProfileInput()
		if (name === '') {
			return
		}
		this.props.dispatch(addProfile(name))
		this.backend.newProfile(name)
	}
	updateProfile = json => {
		this.backend.updateProfile(this.profileSelect.value, json)
		this.hideEditor()
	}
	deleteProfile = () => {
		this.backend.deleteProfile(this.profileSelect.value)
		this.hideEditor()
	}
	selectProfile = e => {
		this.backend.updateProfile(this.profileSelect.value, this.props.profiles[this.profileSelect.value])
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
	getProfileControl() {
		if (!this.state.isDefiningProfile) {
			return this.getProfileSelect()
		} else {
			return this.getProfileInput()
		}
	}
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
				autoFocus
				className="input-profile"
				ref={input => {
					this.profileInput = input
				}}
				onKeyPress={this.handleKeyPress}
				onBlur={this.hideProfileInput}
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
								<BulkControl />
							</div>

							<div className="left clear-after">
								<div className="option-button left" title="Create new deploy profile..." style={{ paddingLeft: '0px' }}>
									<input type="button" value="+" onClick={this.showProfileInput} />
								</div>
								<div className="option-button left" title="Deploy profile">
									{this.getProfileControl()}
								</div>
								<div className="option-button left">
									<div style={{ paddingTop: '2px' }} title="Edit deploy profile settings..." onClick={this.showEditor}>
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
		plugins: state.plugins,
		targets: state.targets,
		profiles: state.profiles,
		currentProfile: state.currentProfile
	}
}
export default connect(mapStateToProps)(TrafficControl)
