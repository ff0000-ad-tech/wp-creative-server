import React, { PureComponent } from 'react'
import './style.scss'
import logo from './images/icon_32.png'

class Header extends PureComponent {
	refreshApp = () => {
		location.href = '/app'
	}
	render() {
		return (
			<header onClick={this.refreshApp}>
				<div className="logo-container clear-after">
					<a href="https://github.com/ff0000-ad-tech" target="_blank">
						<img src={logo} className="left" />
					</a>
					<h1 className="left">Creative Server</h1>
				</div>
			</header>
		)
	}
}

export default Header
