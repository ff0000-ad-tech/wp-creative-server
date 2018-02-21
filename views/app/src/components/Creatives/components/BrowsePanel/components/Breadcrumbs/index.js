import React, { PureComponent } from 'react'

import debug from 'debug'
const log = debug('wp-cs:Breadcrumbs')

import './style.scss'

class Breadcrumbs extends PureComponent {
	constructor() {
		super()
		this.state = {
			browseRoute: ''
		}
	}

	update(browseRoute) {
		log('update')
		this.setState({
			browseRoute
		})
		this.forceUpdate()
	}

	render() {
		log('render')
		log(this.state.browseRoute)
		let path = '/app'
		const chunks = this.state.browseRoute.split('/')
		return (
			<div className="clear-after">
				<div className="reload left" onClick={this.props.onRefresh}>
					<svg version="1.1" width="16" height="16" viewBox="0 0 1000 1000" enableBackground="new 0 0 1000 1000">
					<g><path d="M856.4,149.4C765.8,58.9,641.1,4.2,505.8,4.2C232,4.2,10,226.2,10,500c0,273.8,222,495.8,495.8,495.8c222,0,415.2-147.2,476.2-357.4l-2.2-0.6l0,0c0.7-3.5,1-7.2,1-10.9c0-31.8-25.8-57.6-57.6-57.6c-30.9,0-56.2,24.4-57.6,55c-52.2,151.6-195.7,256.3-359.8,256.3c-210.1,0-380.5-170.3-380.5-380.5s170.3-380.5,380.5-380.5c103.8,0,199.6,42,269.1,111.4L574.9,430.8H990V15.8L856.4,149.4L856.4,149.4z"/></g>
					</svg>
				</div>
				<div className="left">
					<h1>
						<a href={path}>~</a>
						{chunks.map(chunk => {
							if (chunk !== '') {
								path += `/${chunk}`
								return (
									<span key={chunk}>
										<span> / </span>
										<a href={path}>{chunk}</a>
									</span>
								)
							}
						})}
					</h1>
				</div>
			</div>
		)
	}
}

export default Breadcrumbs
