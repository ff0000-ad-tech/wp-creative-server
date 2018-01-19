import React, { PureComponent } from 'react'
import DebugButton from './components/DebugButton'
import TrafficButton from './components/TrafficButton'

import './style.scss'

import debug from 'debug'
const log = debug('wp-cs:app:BuildSize')

class BuildSize extends PureComponent {
	constructor(props) {
		super(props)
	}

	render() {
		if (!this.props.ads.length) {
			return
		}
		return (
			<li className="single-creative">
				<div className="ad-size">{this.props.ads[0].size}</div>

				{this.props.ads.map(ad => {
					const key = `${ad.size}/${ad.index}`
					return (
						<div key={key}>
							<div className="ad-index">
								<div className="build-col col">
									<div className="index-info">
										<div className="hierarchy-grid last-child" />
										<div className="col-vert-nudge">{ad.index}</div>
									</div>
								</div>
								<div className="debug-col col">
									<DebugButton ad={ad} />
								</div>
								<div className="settings-col col col">
									<TrafficButton ad={ad} />
								</div>
							</div>
						</div>
					)
				})}
			</li>
		)
	}
}

export default BuildSize
