import React, { PureComponent } from 'react'
import './style.scss'

class DragBar extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			isDragging: false
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const isDragging = this.state
		if (!prevState.isDragging && isDragging) {
			this.startDrag()
		}
	}

	componentWillUnmount() {}

	handleMouseDown = () => {
		// start dragging
		this.setState({
			isDragging: true
		})
	}

	onDrag = e => {
		// send value to parent
		this.props.parentResizePanels(e.clientX)
	}

	startDrag() {
		document.addEventListener('mousemove', this.onDrag)
		document.addEventListener('mouseup', this.endDrag)
	}

	endDrag = () => {
		this.setState({
			isDragging: false
		})
		document.removeEventListener('mousemove', this.onDrag)
		document.removeEventListener('mouseup', this.endDrag)
	}

	render() {
		return (
			<div
				ref={el => {
					this.node = el
				}}
				onMouseDown={this.handleMouseDown}
				className="drag-bar"
			/>
		)
	}
}

export default DragBar
