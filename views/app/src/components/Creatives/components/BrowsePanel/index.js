import React, { PureComponent } from 'react'

import Breadcrumbs from './components/Breadcrumbs'

import debug from 'debug'
const log = debug('wp-cs:BrowsePanel')

import './style.scss'

class BrowsePanel extends PureComponent {
	constructor() {
		super()
		this.state = {
			deactivated: false
		}
		this.loadPaths = this.getPaths(document.location)
	}

	onDragChanged = state => {
		this.setState({
			deactivated: state
		})
	}

	getPaths(location) {
		log('LOCATION:', location)
		const origin = location.origin
		// app route like: "app", "app/", "app#/"
		const appRoute = location.href.slice(origin.length).match(/^\/[^\/]*/)[0]
		// browse route like: "build/300x250"
		const browseRoute = location.href.slice((origin + appRoute).length)
		return {
			origin,
			appRoute,
			browseRoute
		}
	}

	handleIframeLoad(e) {
		const iframeRoute = this.getIframeRoute(e.target.contentWindow.location)
		window.history.replaceState({}, '', this.loadPaths.appRoute + iframeRoute)
		log(`update history: ${this.loadPaths.appRoute + iframeRoute}`)
		this.breadcrumbs.update(iframeRoute)
	}
	getIframeRoute(location) {
		const paths = this.getPaths(location)
		return location.href.slice(paths.origin.length)		
	}

	render() {
		const deactivatedClass = this.state.deactivated ? 'deactivated' : ''
		log(`render: ${this.loadPaths.origin + this.loadPaths.browseRoute}`)
		return (
			<div className={`browse-panel ${deactivatedClass}`}>
				<div className="title">
					<Breadcrumbs
						ref={ref => {
							this.breadcrumbs = ref
						}}
						loadPaths={this.loadPaths}
						onRefresh={this.refreshIframe}
					/>
				</div>
				<iframe
					ref={ref => {
						this.iframe = ref
					}}
					src={`${this.loadPaths.origin + this.loadPaths.browseRoute}`}
					onLoad={this.handleIframeLoad.bind(this)}
				/>
			</div>
		)
	}

	refreshIframe = e => {
		const iframeRoute = this.getIframeRoute(this.iframe.contentWindow.location)
		this.iframe.src = iframeRoute
	}
}

export default BrowsePanel
