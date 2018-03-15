import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import debug from 'debug'
const log = debug('wp-cs:app:PluginsManager')

import './style.scss'

class PluginsManager extends Component {
	shouldComponentUpdate() {
		return this.props.show ? false : true
	}
	componentDidUpdate() {
		if (!this.props.show) {
			return null
		}
	}
	render() {
		if (!this.props.show) {
			return null
		}
		return (
			<div className="backdrop">
				<div className="modal">
					<div className="header clear-after">
						<div className="title left">Plugins Manager</div>
						<div className="right">
							<input type="button" onClick={this.closeRequested} value="X" />
						</div>
					</div>
					<div className="plugins-header clear-after">
						<div className="name-col left">Plugin</div>
						<div className="state-col left">State</div>
					</div>
					{this.props.plugins ? this.getPlugins() : this.getNoPlugins()}
				</div>
			</div>
		)
	}

	getPlugins() {
		return (
			<ul>
				{Object.keys(this.props.plugins.available).map(plugin => {
					if (plugin in this.props.plugins.installed) {
						return this.getInstalledPlugin(plugin)
					} else {
						return this.getAvailablePlugin(plugin)
					}
				})}
			</ul>
		)
	}

	getNoPlugins() {
		return (
			<div className="no-plugins">
				<span>No plugins have been declared in "./plugins.json" - see </span>
				<a href="https://github.com/ff0000-ad-tech/wp-creative-server">wp-creative-server</a> <span>for more info.</span>
			</div>
		)
	}

	getAvailablePlugin(plugin) {
		return (
			<li key={plugin} className="clear-after">
				<div className="name-col left">{plugin}</div>
				<div className="state-col install-code left">
					<pre>
						<code>npm install {this.props.plugins.available.plugin} --save</code>
					</pre>
				</div>
			</li>
		)
	}

	getInstalledPlugin(plugin) {
		return (
			<li key={plugin}>
				<div className="name-col left">{plugin}</div>
				<div className="state-col version left">v{this.props.plugins.installed[plugin].version}</div>
			</li>
		)
	}

	closeRequested = () => {
		this.props.onClose()
		this.forceUpdate()
	}
}

PluginsManager.propTypes = {
	onClose: PropTypes.func.isRequired,
	show: PropTypes.bool
}

const mapStateToProps = function(state) {
	return {
		plugins: state.plugins
	}
}

export default connect(mapStateToProps)(PluginsManager)