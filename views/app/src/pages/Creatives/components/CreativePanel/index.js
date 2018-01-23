import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import BuildSize from '../BuildSize'
import TrafficControl from '../TrafficControl'

import debug from 'debug'
const log = debug('wp-cs:app:CreativePanel')

import './style.scss'

class CreativePanel extends PureComponent {
	render() {
		// current deploy profile
		let currentProfile = {
			name: '',
			profile: {
				targets: []
			}
		}
		if (this.props.profilesSorted.length) {
			currentProfile.name = this.props.profilesSorted[0].name
			currentProfile.profile = this.props.profiles[currentProfile.name]
		}

		// group targets by size
		const buildSizes = Object.keys(this.props.targets).reduce((buildSizes, id) => {
			const size = this.props.targets[id].size
			if (size in buildSizes) {
				buildSizes[size].push(this.props.targets[id])
			} else {
				buildSizes[size] = [this.props.targets[id]]
			}
			return buildSizes
		}, {})

		// render
		return (
			<div className="creative-panel" style={this.props.style}>
				<div className="title">
					<h1>
						<a>{this.props.creative.name}</a>
					</h1>
				</div>
				<ul className="header-row">
					<li className="build-col col">Build</li>
					<li className="debug-col col">Debug</li>
					<li className="settings-col col">Traffic</li>
				</ul>
				<ul>
					<TrafficControl currentProfile={currentProfile} />
				</ul>
				<ul>
					{Object.keys(buildSizes).map(id => {
						return <BuildSize key={id} currentProfile={currentProfile} ads={buildSizes[id]} />
					})}
				</ul>
			</div>
		)
	}
}
const mapStateToProps = function(state) {
	return {
		creative: state.creative,
		targets: state.targets,
		profiles: state.profiles,
		profilesSorted: state.profilesSorted
	}
}

export default connect(mapStateToProps)(CreativePanel)
