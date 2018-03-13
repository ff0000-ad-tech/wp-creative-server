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
			<header onClick={this.refreshApp}>
				<div className="logo-container clear-after">
					<div className="left">
						<a href="https://github.com/ff0000-ad-tech" target="_blank">
							<img src={logo} className="left" />
						</a>
					</div>
					<div className="app-name left">Creative Server</div>
					<div className="version left">v{appPackage.version}</div>
				</div>
			</header>
		)
	}
}

export default Header
