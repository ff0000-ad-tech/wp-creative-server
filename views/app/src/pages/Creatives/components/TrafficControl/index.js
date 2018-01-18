import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import debug from 'debug'
const log = debug('wp-cs:app:TrafficControl')

import './style.scss'
import settingsIcon from './images/settings-icon.svg'

class TrafficControl extends PureComponent {
	constructor(props) {
		super(props)
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
			<input className="input-profile"
				ref={(input) => { this.profileInput = input }} 
				onKeyPress={this.handleKeyPress}
				type="text" 
			/>
		)
	}
	handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			log('need to update package.json with profile state')
			e.target.blur()
			this.toggleProfileControl()
		}
	}
	getProfileSelect() {
		log(this.props.profiles)
		return (
			<select>
				{Object.keys(this.props.profiles).map(name => {
					log(name)
					return <option key={name} name={name}>{name}</option>
				})}
			</select>
		)
	}
	toggleProfileControl = () => {
		this.setState({
			isDefiningProfile: !this.state.isDefiningProfile
		})
	}

	render() {
		// render
		return (
			<div className="traffic-control-options">
				<li className="build-col col"></li>
				<li className="debug-col col"></li>
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
							<div className="option-button left" style={{ paddingLeft:'0px' }}>
								<input type="button" value="+" onClick={this.toggleProfileControl} />
							</div>
							<div className="option-button left">
								{this.getProfileControl()}
							</div>
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
