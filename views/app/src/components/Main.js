import React, { Component } from 'react'
import { Route, NavLink, HashRouter } from 'react-router-dom'

import Header from './Header'
import Creatives from './Creatives'

import debug from '@ff0000-ad-tech/debug'
const log = debug('wp-cs:app:Main')

import 'reset-css/reset.css'

// public so that `node_modules/serve-index` (routes/browse.js) uses the same boilerplate css
import '../../public/styles.css'

class Main extends Component {
	render() {
		return (
			<div>
				<Header />
				<div className="content">
					<Creatives />
				</div>
			</div>
		)
	}
}

export default Main
