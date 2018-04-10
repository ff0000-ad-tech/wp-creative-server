import React, { Component } from 'react'
import { connect } from 'react-redux'

import debug from '@ff0000-ad-tech/debug'
const log = debug('wp-cs:Breadcrumbs')

import './style.scss'

class Breadcrumbs extends Component {
	constructor() {
		super()
		// this.state = {
		// 	browseRoute: ''
		// }
	}

	// shouldComponentUpdate() {
	// 	return false
	// }

	// update(browseRoute) {
	// 	this.setState({
	// 		browseRoute
	// 	})
	// 	this.forceUpdate()
	// }

	render() {
		let path = ''
		const chunks = this.props.browser.route.split('/')
		return (
			<div className="title clear-after">
				<div className="reload left" onClick={this.props.onRefresh}>
					<svg version="1.1" width="16" height="16" viewBox="0 0 1000 1000" enableBackground="new 0 0 1000 1000">
						<g>
							<path d="M856.4,149.4C765.8,58.9,641.1,4.2,505.8,4.2C232,4.2,10,226.2,10,500c0,273.8,222,495.8,495.8,495.8c222,0,415.2-147.2,476.2-357.4l-2.2-0.6l0,0c0.7-3.5,1-7.2,1-10.9c0-31.8-25.8-57.6-57.6-57.6c-30.9,0-56.2,24.4-57.6,55c-52.2,151.6-195.7,256.3-359.8,256.3c-210.1,0-380.5-170.3-380.5-380.5s170.3-380.5,380.5-380.5c103.8,0,199.6,42,269.1,111.4L574.9,430.8H990V15.8L856.4,149.4L856.4,149.4z" />
						</g>
					</svg>
				</div>
				<div className="left">
					<h1>
						<a onClick={() => this.props.onBrowse('/')}>~</a>
						{chunks.map(chunk => {
							if (chunk !== '') {
								path += `/${chunk}`
								return (path => {
									return (
										<span key={chunk}>
											<span> / </span>
											<a onClick={() => this.props.onBrowse(`${path}/`)}>{chunk}</a>
										</span>
									)
								})(path)
							}
						})}
					</h1>
				</div>
				<div className="open-external right" onClick={this.props.onOpenExternal}>
					<svg version="1.1" id="Capa_1" x="0px" y="0px" width="16" height="16" viewBox="0 0 283.922 283.922">
						<g>
							<path d="M266.422,0h-97.625c-9.65,0-17.5,7.851-17.5,17.5c0,9.649,7.85,17.5,17.5,17.5h55.377l-92.375,92.374
					c-3.307,3.305-5.127,7.699-5.127,12.375c0,4.676,1.819,9.069,5.125,12.371c3.306,3.309,7.699,5.13,12.375,5.13
					c4.674,0,9.069-1.82,12.376-5.127l92.374-92.375v55.377c0,9.649,7.851,17.5,17.5,17.5c9.649,0,17.5-7.851,17.5-17.5V17.5
					C283.922,7.851,276.071,0,266.422,0z" />
							<path d="M201.137,253.922H30V82.785h128.711l30-30H15c-8.284,0-15,6.716-15,15v201.137c0,8.284,6.716,15,15,15h201.137
					c8.284,0,15-6.716,15-15V95.211l-30,30V253.922z" />
						</g>
					</svg>
				</div>
			</div>
		)
	}
}

const mapStateToProps = function(state) {
	return {
		browser: state.browser
	}
}
export default connect(mapStateToProps)(Breadcrumbs)
