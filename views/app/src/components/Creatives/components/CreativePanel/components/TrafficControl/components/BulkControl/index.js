import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Rpc from 'AppSrc/lib/rpc.js'

import debug from 'debug'
const log = debug('wp-cs:app:BulkControl')

import './style.scss'

class BulkControl extends PureComponent {
	constructor(props) {
		super(props)
		this.rpc = new Rpc()
		this.state = {
			controls: {}
		}
	}

	// bulk control
	/* notes
	 *	plugins may "hook" into various points in creative server by defining api callbacks.
	 *	each hook will send different inputs to the callback
	 *	in this case, a list of selected targets
	 */
	componentDidMount() {
		this.updateCheckbox()

		// the default control is a function, the rest would all be API-strings
		let controls = {
			DEPLOY: () => {
				// get all deploy targets
				const targets = this.getAllTargetsAsList()

				// add all deploy targets
				this.rpc.addDeployTargets(this.props.currentProfile.name, targets)

				log(targets)
				log('not yet implementing bulk compile feature...')
				// setInterval(() => {
				// 	xhr(`/api/compile-start/${this.props.currentProfile.name}/${this.props.ad.size}/${this.props.ad.index}`)
				// })
			}
		}
		log(controls)

		// look for plugins that have "TrafficControl" hooks
		if (this.props.plugins) {
			Object.keys(this.props.plugins.installed).forEach(plugin => {
				const packageJson = this.props.plugins.installed[plugin]
				const hooks = 'hooks' in packageJson ? packageJson.hooks : null
				if (hooks && packageJson.hooks.TrafficControl) {
					controls[plugin] = packageJson.hooks.TrafficControl
				}
			})
		}

		this.setState({
			controls
		})
	}
	componentDidUpdate() {
		this.updateCheckbox()
	}

	execute() {
		log('EXECUTE:', this.bulkControl.value)
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
			this.rpc.addDeployTargets(this.props.currentProfile.name, this.getAllTargetsAsList())
		} else {
			this.rpc.removeDeployTargets(this.props.currentProfile.name, this.getAllTargetsAsList())
		}
	}
	getAllTargetsAsList() {
		return Object.keys(this.props.targets).map(key => {
			return this.props.targets[key]
		})
	}

	// render
	render() {
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
							ref={ref => {
								this.bulkControl = ref
							}}
						>
							{Object.keys(this.state.controls).map(control => {
								return (
									<option key={control} value={control}>
										{control}
									</option>
								)
							})}
						</select>
						<div className="left" onClick={this.execute}>
							<div className="execute-button">🔥</div>
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
