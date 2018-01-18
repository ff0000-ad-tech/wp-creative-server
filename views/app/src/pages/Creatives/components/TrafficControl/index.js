import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Rpc from '../../../../lib/rpc.js'

import debug from 'debug'
const log = debug('wp-cs:app:TrafficControl')

import './style.scss'
import settingsIcon from './images/settings-icon.svg'

class TrafficControl extends PureComponent {
	constructor(props) {
		super(props)
		this.rpc = new Rpc()
		this.state = {
			isDefiningProfile: false
		}
	}
	componentDidUpdate() {
		if (this.profileInput) {
			this.profileInput.focus()
		}
	}

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
		const profiles = Object.keys(this.props.profiles).map(name => {
			let profile = Object.assign({}, this.props.profiles[name])
			profile.name = name
			return profile
		})
		const sorted = profiles.sort((a, b) => {
			if (a.updated < b.updated) return 1
			else if (a.updated > b.updated) return -1
			else return 0
		})

		return (
			<select value={sorted.length > 0 ? sorted[0].name : ''} onChange={this.selectProfile}>
				{sorted.map((profile, i) => {
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
	selectProfile = () => {
		log('TODO: select profile')
	}

	render() {
		// render
		return (
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
								<div style={{ paddingTop: '2px' }}>
									<img src={settingsIcon} width="16" height="16" />
								</div>
							</div>
						</div>
					</div>
				</li>
			</div>
		)
	}
}
const mapStateToProps = function(state) {
	return {
		profiles: state.profiles
	}
}

export default connect(mapStateToProps)(TrafficControl)
