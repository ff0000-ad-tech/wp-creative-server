import React, { PureComponent } from 'react'

import PluginsManager from './components/PluginsManager'

import './style.scss'
import logo from './images/icon_32.png'
import appPackage from 'Root/package.json'

import debug from 'debug'
const log = debug('wp-cs:app:Header')

class Header extends PureComponent {
	constructor() {
		super()
		this.state = {
			showEditor: false
		}
	}

	/* -- Editor Control ----
	 *
	 * 
	 */
	showEditor = e => {
		e.stopPropagation()
		this.setState({
			showEditor: true
		})
	}
	hideEditor = () => {
		this.setState({
			showEditor: false
		})
	}

	refreshApp = () => {
		location.href = '/app'
	}

	render() {
		return (
			<div>
				<PluginsManager show={this.state.showEditor} onClose={this.hideEditor} />
				<div className="site-header clear-after" onClick={this.refreshApp}>
					<div className="logo-container left">
						<a href="https://github.com/ff0000-ad-tech" target="_blank">
							<div>
								<img src={logo} className="left" />
								<div className="app-name left">Creative Server</div>
								<div className="version left">v{appPackage.version}</div>
							</div>
						</a>
					</div>

					<div className="right">
						<div className="plugins button" onClick={this.showEditor}>
							PLUGINS
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Header
