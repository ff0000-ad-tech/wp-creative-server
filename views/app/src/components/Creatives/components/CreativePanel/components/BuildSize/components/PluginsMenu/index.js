import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import debug from 'debug'
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
		return (
			<ul>
				{Object.keys(this.props.plugins.installed).map(plugin => {
					return (
						<li
							key={plugin}
							onClick={() => {
								this.launchPlugin(plugin)
							}}
						>
							<div className="plugin-name">{plugin}</div>
						</li>
					)
				})}
			</ul>
		)
	}

	launchPlugin(plugin) {
		const pluginMain = this.props.plugins.installed[plugin].main
		location.href = `/${plugin}/${this.props.size}`
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
