import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import SingleCreative from '../SingleCreative'

import debug from 'debug'
const log = debug('wp-cs:app:CreativePanel')

import './style.scss'

class CreativePanel extends PureComponent {
	render() {
		return (
			<div className="creative-panel" style={this.props.style}>
				<div className="title">wp-creative-server</div>
				<ul className="header-row">
					<li className="build-col col">Builds</li>
					<li className="compile-col col">Compiling</li>
					<li className="deploy-col col">Deployed</li>
				</ul>
				<ul>
					{Object.keys(this.props.targets).map(target => {
						log(target)
						// return <SingleCreative data={item} key={index} />
					})}
				</ul>
			</div>
		)
	}
}
const mapStateToProps = function(state) {
	return {
		targets: state.targets
	}
}

export default connect(mapStateToProps)(CreativePanel)
