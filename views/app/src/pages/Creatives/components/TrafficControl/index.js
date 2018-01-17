import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import debug from 'debug'
const log = debug('wp-cs:app:TrafficControl')

import './style.scss'
import settingsIcon from './images/settings-icon.svg'

class TrafficControl extends PureComponent {
	render() {
		// render
		return (
			<div className="traffic-control-options">
				<li className="build-col col"></li>
				<li className="debug-col col"></li>
				<li className="settings-col col">
					<div className="clear-after">
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
								<input type="button" value="+" />
							</div>
							<div className="option-button left">
								<select>
									<option>Default</option>
								</select>
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
	return {}
}

export default connect(mapStateToProps)(TrafficControl)
