import React, { PureComponent } from 'react'
import './style.scss'

import debug from 'debug'
const log = debug('wp-cs:app:DeployButton')

import webpackLogo from './images/webpack.svg'

class DeployButton extends PureComponent {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<a href="">
				<img src={webpackLogo} width="21" height="21" />
			</a>
		)
	}
}

export default DeployButton
