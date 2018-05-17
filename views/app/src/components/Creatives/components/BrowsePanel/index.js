import React, { Component } from 'react'
import { connect } from 'react-redux'
import { route, iframeSrcCanUpdateState } from '../../../../services/browser/actions.js'

import Breadcrumbs from './components/Breadcrumbs'

import debug from '@ff0000-ad-tech/debug'
const log = debug('wp-cs:BrowsePanel')
const log1 = debug('wp-cs:BrowsePanel+')
debug.disable('wp-cs:BrowsePanel+')

import './style.scss'

class BrowsePanel extends Component {
	constructor() {
		super()
		this.state = {
			deactivated: false
		}
	}

	// used by DragBar to make the drag go smoothly
	onDragChanged = state => {
		this.setState(
			{
				deactivated: state
			},
			() => {
				if (this.state.deactivated) {
					this.browsePanelElement.classList.add('deactivated')
				} else {
					this.browsePanelElement.classList.remove('deactivated')
				}
			}
		)
	}

	// we control the update cycle, so the iframe only reloads when the route changes
	componentWillMount() {
		this.setState({
			iframeSrc: this.props.browser.origin + this.props.browser.route,
			iframeSrcCanUpdateState: false
		})
	}
	componentDidMount() {
		this.componentDidUpdate()
	}
	componentDidUpdate() {
		log(`update iframe src: ${this.state.iframeSrc}`)
		this.iframe.src = this.state.iframeSrc
	}
	shouldComponentUpdate() {
		return false
	}
	// redux changes to browser route will cause component to receive new props
	componentWillReceiveProps(next) {
		if (next.browser.route !== this.props.browser.route) {
			if (next.browser.renderIframe) {
				log1('recvd props WILL UPDATE::::')
				log1(' THIS:', this.props.browser.route)
				log1(' NEXT:', next.browser.route)
				this.setState(
					{
						iframeSrc: next.browser.origin + next.browser.route,
						iframeSrcCanUpdateState: false // don't respond to iframe load event
					},
					() => {
						this.forceUpdate()
					}
				)
			}
		}
	}

	// any time the iframe reloads
	handleIframeLoad = e => {
		// update browser history
		const iframeRoute = this.getIframeRoute(e.target.contentWindow.location)
		window.history.replaceState({}, '', this.props.browser.appPath + iframeRoute)
		log(`update history: ${this.props.browser.appPath + iframeRoute}`)

		// src changes from inside iframe must propagate route to state
		if (this.state.iframeSrcCanUpdateState) {
			log1('...iframe update propagating to state ->')
			const renderIframe = false
			this.props.dispatch(route(iframeRoute, renderIframe))
		} else {
			log1('-- iframe state updated --')
			this.setState({
				iframeSrcCanUpdateState: true
			})
		}
	}
	getIframeRoute(location) {
		return location.href.slice(location.origin.length)
	}

	// render
	render() {
		const deactivatedClass = this.state.deactivated ? 'deactivated' : ''
		return (
			<div
				ref={ref => {
					this.browsePanelElement = ref
				}}
				className={`browse-panel ${deactivatedClass}`}
			>
				<div>
					<Breadcrumbs
						ref={ref => {
							this.breadcrumbs = ref
						}}
						onBrowse={this.goto}
						onRefresh={this.refreshIframe}
						onOpenExternal={this.openExternal}
					/>
				</div>
				<div className="iframe-container">
					<iframe
						ref={ref => {
							this.iframe = ref
						}}
						// src={this.state.iframeSrc}
						onLoad={this.handleIframeLoad}
					/>
				</div>
			</div>
		)
	}

	goto = routePath => {
		const renderIframe = true
		this.props.dispatch(route(routePath, renderIframe))
	}
	refreshIframe = e => {
		console.clear()
		const iframeRoute = this.getIframeRoute(this.iframe.contentWindow.location)
		this.iframe.src = iframeRoute
	}
	openExternal = e => {
		const iframeRoute = this.getIframeRoute(this.iframe.contentWindow.location)
		window.open(this.props.browser.origin + iframeRoute, '_blank')
	}
}

const mapStateToProps = function(state) {
	return {
		browser: state.browser
	}
}
export default connect(mapStateToProps, null, null, { withRef: true })(BrowsePanel)
