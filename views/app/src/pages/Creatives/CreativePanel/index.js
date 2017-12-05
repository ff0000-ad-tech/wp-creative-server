import React, { PureComponent } from 'react'
import SingleCreative from '../SingleCreative'

import './style.scss'

class CreativePanel extends PureComponent {
	render() {
		// temp
		const builds = [{}, {}]
		return (
			<div className="creative-panel" style={this.props.style}>
				<div className="title">wp-creative-server</div>
				<ul className="header-row">
					<li className="build-col col">Builds</li>
					<li className="compile-col col">Compiling</li>
					<li className="deploy-col col">Deployed</li>
				</ul>
				<ul>
					{builds.map((item, index) => {
						return <SingleCreative data={item} key={index} />
					})}
				</ul>
			</div>
		)
	}
}

export default CreativePanel
