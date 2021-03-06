import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import PluginsManager from './components/PluginsManager'
import { xhr } from 'AppSrc/lib/utils.js'

import './style.scss'
import logo from './images/icon_32.png'

import debug from '@ff0000-ad-tech/debug'
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

	exitCs() {
		if (window.confirm('Do you want to shut down Creative Server?')) {
			window.open('/api/exit')
		}
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
								<div className="version left">v{this.props.appMeta.version || ''}</div>
							</div>
						</a>
					</div>

					<div className="control-menu right">
						<div className="plugins button" onClick={this.showEditor}>
							PLUGINS
						</div>
						<div className="exit button" onClick={this.exitCs}>
							X
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = function(state) {
	return {
		appMeta: state.appMeta
	}
}

export default connect(mapStateToProps)(Header)
