import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Rpc from '../../../../lib/rpc.js'

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
	componentDidUpdate() {
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
	handleKeyPress = e => {
		if (e.key === 'Enter') {
			this.rpc.newProfile(this.profileInput.value)
			e.target.blur()
			this.toggleProfileControl()
		}
	}
	getProfileSelect() {
		return (
			<select
				ref={select => {
					this.profileSelect = select
				}}
				value={this.props.selectedProfile}
				onChange={this.selectProfile}
			>
				{this.props.sorted.map((profile, i) => {
					return (
						<option key={profile.name} value={profile.name}>
							{profile.name}
						</option>
					)
				})}
			</select>
		)
	}
	toggleProfileControl = () => {
		this.setState({
			isDefiningProfile: !this.state.isDefiningProfile
		})
	}
	selectProfile = e => {
		this.rpc.updateProfile(this.profileSelect.value, this.props.profiles[this.profileSelect.value])
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
	updateProfile = json => {
		this.rpc.updateProfile(this.profileSelect.value, json)
		this.hideEditor()
	}
	deleteProfile = () => {
		this.rpc.deleteProfile(this.profileSelect.value)
		this.hideEditor()
	}

	/* -- Render ----
	 *
	 * 
	 */
	render() {
		// render
		return (
			<div>
				<div className="traffic-control-options">
					<li className="build-col col" />
					<li className="debug-col col" />
					<li className="settings-col col">
						<div className="settings clear-after">
							<div className="right clear-after">
								<div className="option-checkbox right">
									<input type="checkbox" />
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
					profileName={this.profileSelect ? this.profileSelect.value : ''}
				/>
			</div>
		)
	}
}

/* -- Data/State ----
	*
	* 
	*/
TrafficControl.propTypes = {
	selectedProfile: PropTypes.string.isRequired
}

const mapStateToProps = function(state) {
	return {
		profiles: state.profiles,
		sorted: state.sorted
	}
}
export default connect(mapStateToProps)(TrafficControl)
