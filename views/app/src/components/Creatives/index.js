import React, { Component } from 'react'
import CreativePanel from './components/CreativePanel'
import BrowsePanel from './components/BrowsePanel'
import DragBar from './components/DragBar'

import debug from 'debug'
const log = debug('wp-cs:app:Creatives')

import './style.scss'

const PANEL_SIZE_LIMIT = [10, 90]

class Creatives extends Component {
	constructor(props) {
		super(props)
		this.state = {
			leftWidthPerc: 50
		}
	}

	resizePanels = middleX => {
		const perc = middleX * 100 / window.innerWidth
		const limitedPerc = Math.min(Math.max(PANEL_SIZE_LIMIT[0], perc), PANEL_SIZE_LIMIT[1])
		this.setState({
			leftWidthPerc: limitedPerc
		})
	}

	onDragChanged = state => {
		this.browsePanel.getWrappedInstance().onDragChanged(state)
	}

	render() {
		const creativeStyle = {
			width: `${this.state.leftWidthPerc}%`
		}

		return (
			<div className="page creatives">
				<CreativePanel style={creativeStyle} />
				<DragBar parentResizePanels={this.resizePanels} parentOnDragChanged={this.onDragChanged} />
				<BrowsePanel ref={el => (this.browsePanel = el)} />
			</div>
		)
	}
}

export default Creatives
