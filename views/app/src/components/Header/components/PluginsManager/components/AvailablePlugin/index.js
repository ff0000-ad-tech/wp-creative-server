import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Rpc from 'AppSrc/lib/rpc.js'

import debug from '@ff0000-ad-tech/debug'
const log = debug('wp-cs:app:AvailablePlugin')

import '../../style.scss'

class AvailablePlugin extends Component {
	constructor() {
		super()
		this.rpc = new Rpc()
		this.state = {
			showDialog: false
		}
	}

	render() {
		const dialog = this.state.showDialog ? 'show' : ''
		return (
			<li key={this.props.plugin} className="clear-after">
				<div className="name-col left">{this.props.plugin}</div>
				<div className="state-col install-code right" title="Copy NPM install command to clipboard">
					<input
						type="button"
						onClick={() => {
							this.copyPluginInstallCmd()
						}}
						value="Get Install Command"
					/>
				</div>
				<div className={`dialog left ${dialog}`}>Copied!</div>
			</li>
		)
	}

	copyPluginInstallCmd() {
		const installCmd = `npm install ${this.props.plugins.available[this.props.plugin]} --save`
		this.rpc.copyToClipboard(installCmd, () => {
			this.setState({
				showDialog: true
			})
			setTimeout(() => {
				this.setState({
					showDialog: false
				})
				this.forceUpdate()
			}, 700)
			this.forceUpdate()
		})
	}
}

AvailablePlugin.propTypes = {
	plugin: PropTypes.string
}

const mapStateToProps = function(state) {
	return {
		plugins: state.plugins
	}
}

export default connect(mapStateToProps)(AvailablePlugin)
