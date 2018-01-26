import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import BuildSize from './components/BuildSize'
import TrafficControl from './components/TrafficControl'

import debug from 'debug'
const log = debug('wp-cs:app:CreativePanel')

import './style.scss'

class CreativePanel extends PureComponent {
	render() {
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
					<TrafficControl />
				</ul>
				<ul>
					{Object.keys(buildSizes).map(id => {
						return <BuildSize key={id} ads={buildSizes[id]} />
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
		currentProfile: state.currentProfile
	}
}

export default connect(mapStateToProps)(CreativePanel)
