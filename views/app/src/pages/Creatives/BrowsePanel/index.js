import React, { PureComponent } from 'react'
import './style.scss'

class BrowsePanel extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			deactivated: false
		}
	}

	onDragChanged = state => {
		this.setState({
			deactivated: state
		})
	}

	render() {
		const deactiveClass = this.state.deactivated ? 'deactivated' : ''
		return (
			<div className={`browse-panel ${deactiveClass}`}>
				<iframe src="/" />
			</div>
		)
	}
}

export default BrowsePanel
