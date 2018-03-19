import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Rpc from 'AppSrc/lib/rpc.js'
import { xhr, getPluginRequest, getOutputRoute } from 'AppSrc/lib/utils.js'

import debug from 'debug'
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

	// bulk control
	/* notes
	 *	plugins may "hook" into various points in creative server by defining api callbacks.
	 *	each hook will send different inputs to the callback
	 *	in this case, a list of selected targets
	 */
	updateControls() {
		let controls = {}
		// look for plugins that have "bulk-control" hooks
		if (this.props.plugins) {
			Object.keys(this.props.plugins.installed).forEach(plugin => {
				const settings = this.getPluginSettings(plugin)
				if (this.hasHook(settings, 'bulk-control')) {
					// we expect only one command-per-hook
					controls[plugin] = Object.keys(settings.hooks['bulk-control'])[0]
				}
			})
		}
		return controls
	}

	// plugin pathing utility
	getPluginSettings(plugin) {
		if ('wp-creative-server' in this.props.plugins.installed[plugin]) {
			return this.props.plugins.installed[plugin]['wp-creative-server']
		}
	}
	hasHook(settings, hook) {
		return 'hooks' in settings && hook in settings.hooks
	}

	execute = () => {
		// get plugin from hook-label
		for (var plugin in this.props.plugins.installed) {
			const settings = this.getPluginSettings(plugin)
			if (this.hasHook(settings, 'bulk-control')) {
				if (this.bulkControl.value in settings.hooks['bulk-control']) {
					const args = {
						targets: this.getSelectedTargets()
					}
					const req = getPluginRequest(plugin, settings.hooks['bulk-control'][this.bulkControl.value], args)
					// log(req)
					xhr(req)
					return
				}
			}
		}
	}
	getSelectedTargets() {
		let targets = {}
		Object.keys(this.props.targets).forEach(target => {
			const outputRoute = getOutputRoute(this.props.targets[target].size, this.props.targets[target].index, this.props.currentProfile.name)
			targets[`${this.props.currentProfile.name}/${target}`] = outputRoute
		})
		return targets
	}

	updateCheckbox() {
		if (!Object.keys(this.props.targets).length) {
			this.checkbox.checked = false
			return
		}
		// check available targets
		for (var key in this.props.targets) {
			const target = this.props.targets[key]
			// check if selected-profile has available target
			let isSelected = false
			const profileTargets = this.props.currentProfile.profile.targets
			for (var i = 0; i < profileTargets.length; i++) {
				if (profileTargets[i].size === target.size && profileTargets[i].index === target.index) {
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
			this.rpc.addDeployTargets(this.props.currentProfile.name, this.getAllTargets())
		} else {
			this.rpc.removeDeployTargets(this.props.currentProfile.name, this.getAllTargets())
		}
	}
	getAllTargets() {
		return Object.keys(this.props.targets).map(key => {
			return this.props.targets[key]
		})
	}

	// render
	render() {
		const controls = this.updateControls()
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
