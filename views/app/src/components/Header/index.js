import React, { PureComponent } from 'react'
import './style.scss'
import logo from './images/icon_32.png'
import appPackage from 'Root/package.json'

import debug from 'debug'
const log = debug('wp-cs:app:Header')

class Header extends PureComponent {
	componentDidMount() {
		log(appPackage)
	}
	refreshApp = () => {
		location.href = '/app'
	}
	render() {
		return (
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
					<a href="/" target="_blank">
						<div className="plugins button">PLUGINS</div>
					</a>
				</div>
			</div>
		)
	}
}

export default Header
