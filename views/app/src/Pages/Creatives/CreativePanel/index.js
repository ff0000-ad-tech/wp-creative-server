import React, { PureComponent } from 'react'
import './style.scss'

class CreativePanel extends PureComponent {
	render() {
		return (
			<div className="creative-panel" style={this.props.style}>
				<div className="title">wp-creative-server</div>
			</div>
		)
	}
}

export default CreativePanel
