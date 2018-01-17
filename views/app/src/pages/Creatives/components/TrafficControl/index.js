import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import debug from 'debug'
const log = debug('wp-cs:app:TrafficControl')

import './style.scss'

class TrafficControl extends PureComponent {
	render() {
		// render
		return (
			<div className="traffic-control-options">
				<li className="build-col col"></li>
				<li className="debug-col col"></li>
				<li className="traffic-col col" />
				<li className="last-traffic-col col">
					<div class="clear-after">
						<div class="option-checkbox right">
							<input type="checkbox" />
						</div>
						<div class="option-button right">
							<input type="button" value="DEPLOY" />
						</div>
						<div class="option-button right">
							<input type="button" value="Settings" />
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
