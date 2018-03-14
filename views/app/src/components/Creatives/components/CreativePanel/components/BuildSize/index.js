import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { BUILD_FOLDER } from 'Root/lib/utils.js'
import PluginsMenu from './components/PluginsMenu'
import DebugButton from './components/DebugButton'
import TrafficButton from './components/TrafficButton'
import { route } from 'Root/views/app/src/services/browser/actions.js'

import './style.scss'
import pluginSvg from './images/plugin.svg'
import nextChild from './images/next-child.png'
import lastChild from './images/last-child.png'

import debug from 'debug'
const log = debug('wp-cs:app:BuildSize')

class BuildSize extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			showPluginsMenu: false
		}
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
				<div className="clear-after">
					<div
						className="ad-size left"
						onClick={e => {
							this.gotoBuild(this.props.ads[0].size)
						}}
						title="Browse to this build size"
					>
						{this.props.ads[0].size}
					</div>
					{this.props.plugins.installed && Object.keys(this.props.plugins.installed).length
						? this.getPluginsButton(this.props.ads[0].size)
						: null}
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

	getPluginsButton(size) {
		return (
			<div className="plugin-button left" onClick={this.showPluginsMenu}>
				<svg version="1.1" width="11" height="11" x="0px" y="0px" viewBox="0 0 1000 1000" enableBackground="new 0 0 1000 1000">
					<g>
						<path d="M972,289.4c-24.1-24.1-63.1-24.1-87.1,0L739.6,434.7L565.4,260.4l145.2-145.2c24.1-24.1,24.1-63.1,0-87.1S647.5,4,623.4,28L478.2,173.3l-87.1-87.1L267.7,209.5c-128,128-138.9,328.3-33.4,469.1L28,884.8C4,908.9,4,947.9,28,972s63.1,24.1,87.1,0l206.2-206.2c140.8,105.4,341.1,94.6,469.1-33.4l123.4-123.4l-87.1-87.1l145.2-145.2C996,352.5,996,313.5,972,289.4z" />
					</g>
				</svg>
				<PluginsMenu
					menuTop={this.state.menuTop}
					menuLeft={this.state.menuLeft}
					show={this.state.showPluginsMenu}
					onClose={this.hidePluginsMenu}
					size={size}
				/>
			</div>
		)
	}
	/* -- Plugins Menu Control ----
	 *
	 * 
	 */
	showPluginsMenu = e => {
		e.stopPropagation()
		this.setState({
			showPluginsMenu: true,
			menuTop: e.clientY - 10,
			menuLeft: e.clientX - 10
		})
	}
	hidePluginsMenu = () => {
		this.setState({
			showPluginsMenu: false
		})
	}
}

BuildSize.propTypes = {
	ads: PropTypes.array.isRequired
}
const mapStateToProps = function(state) {
	return {
		browser: state.browser,
		plugins: state.plugins
	}
}
export default connect(mapStateToProps)(BuildSize)
