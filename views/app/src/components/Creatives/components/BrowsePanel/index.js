import React, { PureComponent } from 'react'

import debug from 'debug'
const log = debug('wp-cs:BrowsePanel')

import './style.scss'

class BrowsePanel extends PureComponent {
	constructor() {
		super()

		this.state = {
			deactivated: false
		}
		// dissect current location for history management
		this.componentPaths = this.getComponentPaths(document.location)

		// prevent iframe onload when popping
		// this.popping = false
		// // listen for pop-state
		// window.onpopstate = (e) => {
		// 	log('popped to:', document.location)
		// 	const paths = this.getComponentPaths(document.location)
		// 	this.popping = true
		// 	this.refs['browse-iframe'].src = `${this.componentPaths.origin + paths.browseRoute}`
		// }
	}

	onDragChanged = state => {
		this.setState({
			deactivated: state
		})
	}

	getComponentPaths(location) {
		const origin = location.origin
		// app route like: "app", "app/", "app#/"
		const appRoute = location.href.slice(origin.length).match(/^\/[^\/]*/)[0]

		// browse route like: "build/300x250"
		const browseRoute = location.href.slice((origin + appRoute).length)

		const componentPaths = {
			origin,
			appRoute,
			browseRoute
		}
		return componentPaths
	}

	handleIframeLoad(e) {
		// let the next reload alter the history
		// if (this.popping) {
		// 	log('<<<<< popping complete')
		// 	log(window.history)
		// 	this.popping = false
		// 	return
		// }
		const paths = this.getComponentPaths(e.target.contentWindow.location)
		const browseRoute = e.target.contentWindow.location.href.slice(paths.origin.length)
		window.history.replaceState({}, '', this.componentPaths.appRoute + browseRoute)
		log(`update history${this.componentPaths.appRoute + browseRoute}`)
	}

	render() {
		const deactivatedClass = this.state.deactivated ? 'deactivated' : ''
		log(`render: ${this.componentPaths.origin + this.componentPaths.browseRoute}`)
		return (
			<div className={`browse-panel ${deactivatedClass}`}>
				<iframe
					ref="browse-iframe"
					src={`${this.componentPaths.origin + this.componentPaths.browseRoute}`}
					onLoad={this.handleIframeLoad.bind(this)}
				/>
			</div>
		)
	}
}

export default BrowsePanel
