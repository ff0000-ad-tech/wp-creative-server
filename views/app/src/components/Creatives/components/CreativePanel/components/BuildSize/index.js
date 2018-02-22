import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { BUILD_FOLDER } from 'Root/lib/utils.js'
import DebugButton from './components/DebugButton'
import TrafficButton from './components/TrafficButton'
import { route } from 'Root/views/app/src/services/browser/actions.js'

import './style.scss'
import nextChild from './images/next-child.png'
import lastChild from './images/last-child.png'

import debug from 'debug'
const log = debug('wp-cs:app:BuildSize')

class BuildSize extends PureComponent {
	constructor(props) {
		super(props)
	}

	gotoBuild = size => {
		this.props.dispatch(route(`/${BUILD_FOLDER}/${size}`))
	}

	render() {
		if (!this.props.ads.length) {
			return
		}
		return (
			<li className="single-creative">
				<div
					className="ad-size"
					onClick={e => {
						this.gotoBuild(this.props.ads[0].size)
					}}
					title="Browse to this build size"
				>
					{this.props.ads[0].size}
				</div>

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
								<DebugButton ad={ad} />
							</div>
							<div className="settings-col col col">
								<TrafficButton ad={ad} />
							</div>
						</div>
					)
				})}
			</li>
		)
	}
}

BuildSize.propTypes = {
	ads: PropTypes.array.isRequired
}
const mapStateToProps = function(state) {
	return {
		browser: state.browser
	}
}
export default connect(mapStateToProps)(BuildSize)
