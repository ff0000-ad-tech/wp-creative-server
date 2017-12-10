import React, { PureComponent } from 'react'
import './style.scss'

class SingleCreative extends PureComponent {
	constructor(props) {
		super(props)
	}

	render() {
		// const compileClass =
		const key = `creative${this.props.index}`
		return (
			<li className="single-creative" key={key}>
				<div className="build-col col" />
				<div className="compile-col col">
					<div className="compile-btn" />
				</div>
				<div className="deploy-col col" />
			</li>
		)
	}
}

export default SingleCreative
