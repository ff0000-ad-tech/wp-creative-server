import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Rpc from 'AppSrc/lib/rpc.js'
import { xhr, getOutputRoute } from 'AppSrc/lib/utils.js'
import * as plugins from 'AppSrc/lib/plugins.js'

import debug from '@ff0000-ad-tech/debug'
const log = debug('wp-cs:app:BulkControl')

import './style.scss'

class BulkControl extends PureComponent {
	constructor(props) {
		super(props)
		this.rpc = new Rpc()
	}
	componentDidUpdate() {
		this.updateCheckbox()
	}

	execute = () => {
		// get plugin from hook-label
		for (var plugin in this.props.plugins.installed) {
			const settings = plugins.getPluginSettings(this.props.plugins, plugin)
			if (plugins.hasHook(settings, 'bulk-control')) {
				if (this.bulkControl.value in settings.hooks['bulk-control']) {
					const args = {
						profile: this.props.currentProfile.name,
						targets: this.getSelectedTargets()
					}
					const req = plugins.getPluginRequest(plugin, settings.hooks['bulk-control'][this.bulkControl.value], args)
					xhr(
						req,
						err => {
							alert(err)
						},
						result => {
							log(result)
						}
					)
					return
				}
			}
		}
	}
	getSelectedTargets() {
		let targets = {}
		const selectedTargets = this.props.profiles[this.props.currentProfile.name].targets
		selectedTargets.forEach(target => {
			const outputRoute = getOutputRoute(target.size, target.index, this.props.currentProfile.name)
			targets[`${this.props.currentProfile.name}/${target.size}/${target.index}`] = outputRoute
		})
		return targets
	}

	updateCheckbox() {
		if (!this.checkbox) {
			return
		}
		const currentProfile = this.props.profiles[this.props.currentProfile.name]
		if (!currentProfile) {
			return
		}
		const targets = this.props.profiles[this.props.currentProfile.name].targets
		if (!Object.keys(targets).length) {
			this.checkbox.checked = false
			return
		}
		// check available targets
		for (var key in this.props.targets) {
			const atarget = this.props.targets[key]
			// check if selected-profile has available target
			let isSelected = false
			// const profileTargets = this.props.currentProfile.profile.targets
			for (var i = 0; i < targets.length; i++) {
				if (targets[i].size === atarget.size && targets[i].index === atarget.index) {
					isSelected = true
					break
				}
			}
			if (!isSelected) {
				this.checkbox.checked = false
				return
			}
		}
		this.checkbox.checked = true
	}

	// select/deselect all targets
	onChecked = e => {
		if (e.target.checked) {
			this.rpc.addDeployTargets(this.props.profiles, this.props.currentProfile.name, this.getAllTargets())
		} else {
			this.rpc.removeDeployTargets(this.props.profiles, this.props.currentProfile.name, this.getAllTargets())
		}
	}
	getAllTargets() {
		return Object.keys(this.props.targets).map(key => {
			return this.props.targets[key]
		})
	}

	// render
	render() {
		const controls = plugins.getPluginControls(this.props.plugins, 'bulk-control')
		if (!controls) {
			return null
		}
		return (
			<div>
				<div className="option-checkbox right">
					<input
						ref={checkbox => {
							this.checkbox = checkbox
						}}
						type="checkbox"
						onChange={this.onChecked}
					/>
				</div>
				<div className="option-button right">
					<div className="clear-after">
						<select
							className="left"
							title="Select bulk control"
							ref={ref => {
								this.bulkControl = ref
							}}
						>
							{Object.keys(controls).map(plugin => {
								const label = controls[plugin]
								return (
									<option key={label} value={label}>
										{label}
									</option>
								)
							})}
						</select>
						<div className="left" onClick={this.execute}>
							<div className="execute-button" title="Execute bulk control">
								🔥
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

/* -- Data/State ----
	*
	* 
	*/
const mapStateToProps = function(state) {
	return {
		plugins: state.plugins,
		targets: state.targets,
		profiles: state.profiles,
		currentProfile: state.currentProfile
	}
}
export default connect(mapStateToProps)(BulkControl)
