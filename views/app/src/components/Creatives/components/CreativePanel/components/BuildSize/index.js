import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import DebugButton from './components/DebugButton'
import TrafficButton from './components/TrafficButton'

import './style.scss'
import nextChild from './images/next-child.png'
import lastChild from './images/last-child.png'

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

				{this.props.ads.map((ad, i) => {
					const key = `${ad.size}/${ad.index}`
					const hierachyImage = i < this.props.ads.length - 1 ? nextChild : lastChild
					return (
						<div key={key} className="ad-index">
							<div className="build-col col">
								<div className="index-info">
									<div className="hierarchy-grid">
										<img src={hierachyImage} />
									</div>
									<div className="col-vert-nudge">{ad.index}</div>
								</div>
							</div>
							<div className="debug-col col">
								<DebugButton currentProfile={this.props.currentProfile} ad={ad} />
							</div>
							<div className="settings-col col col">
								<TrafficButton currentProfile={this.props.currentProfile} ad={ad} />
							</div>
						</div>
					)
				})}
			</li>
		)
	}
}

BuildSize.propTypes = {
	currentProfile: PropTypes.object.isRequired,
	// list of targets that are the same size
	ads: PropTypes.array.isRequired
}

export default BuildSize
