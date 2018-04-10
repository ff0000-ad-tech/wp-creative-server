import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as plugins from 'AppSrc/lib/plugins.js'

import debug from '@ff0000-ad-tech/debug'
const log = debug('wp-cs:app:PluginsMenu')

import './style.scss'

class PluginsMenu extends Component {
	handleMouseMove = e => {
		const inWidth = e.clientX >= this.menu.offsetLeft && e.clientX < this.menu.offsetLeft + this.menu.offsetWidth
		const inHeight = e.clientY >= this.menu.offsetTop && e.clientY < this.menu.offsetTop + this.menu.offsetHeight
		if (!inWidth || !inHeight) {
			this.props.onClose()
			this.forceUpdate()
		}
	}
	shouldComponentUpdate() {
		return this.props.show ? false : true
	}
	componentDidUpdate() {
		if (this.props.show) {
			document.addEventListener('mousemove', this.handleMouseMove)
		} else {
			document.removeEventListener('mousemove', this.handleMouseMove)
			return null
		}
	}
	render() {
		if (!this.props.show) {
			return null
		}
		return (
			<div
				ref={ref => {
					this.menu = ref
				}}
				className="menu"
				style={{ top: this.props.menuTop, left: this.props.menuLeft }}
			>
				{this.getPlugins()}
			</div>
		)
	}

	getPlugins() {
		const controls = plugins.getPluginControls(this.props.plugins, 'size-control')
		return (
			<ul>
				{Object.keys(controls).map(plugin => {
					return (
						<li
							key={plugin}
							onClick={() => {
								this.launchPlugin(plugin, controls[plugin])
							}}
						>
							<div className="plugin-name">{controls[plugin]}</div>
						</li>
					)
				})}
			</ul>
		)
	}

	launchPlugin(plugin, label) {
		const args = {
			size: this.props.size
		}
		const settings = plugins.getPluginSettings(this.props.plugins, plugin)
		const req = plugins.getPluginRequest(plugin, settings.hooks['size-control'][label], args)
		location.href = req
	}
}

PluginsMenu.propTypes = {
	onClose: PropTypes.func.isRequired,
	show: PropTypes.bool,
	menuTop: PropTypes.number,
	menuLeft: PropTypes.number,
	size: PropTypes.string
}

const mapStateToProps = function(state) {
	return {
		plugins: state.plugins
	}
}

export default connect(mapStateToProps)(PluginsMenu)
