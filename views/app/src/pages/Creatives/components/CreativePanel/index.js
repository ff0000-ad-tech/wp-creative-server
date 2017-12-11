import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import BuildSize from '../BuildSize'

import debug from 'debug'
const log = debug('wp-cs:app:CreativePanel')

import './style.scss'

class CreativePanel extends PureComponent {
	render() {
		// group indexes by size
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
				<div className="title">{this.props.creative.name}</div>
				<ul className="header-row">
					<li className="build-col col">Builds</li>
					<li className="compile-col col">Compiling</li>
					<li className="deploy-col col">Deployed</li>
					<li className="last-deploy-col col" />
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
		targets: state.targets
	}
}

export default connect(mapStateToProps)(CreativePanel)
