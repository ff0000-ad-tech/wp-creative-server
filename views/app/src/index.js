import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import configureStore from './store.js'

import debug from 'debug'
const log = debug('wp-cs:app:index')

// create redux store
let store = configureStore({
	creative: {},
	targets: {},
	profiles: {}
})

// server connection
import Rpc from './lib/rpc.js'
let rpc = new Rpc({
	store: store
})
rpc.connect(() => {
	// get creative
	rpc.getCreative()

	// get targets
	rpc.getTargets()

	// get profiles
	rpc.getProfiles()

	// update cycle
	let cycle = 0
	const readFsOn = 20
	const readPackageOn = 20
	const returnStateOn = 1
	const cycleLength = 2000 // milliseconds
	setInterval(() => {
		if (cycle % readFsOn === 0) {
			rpc.getTargets()
		}
		if (cycle % readPackageOn === 0) {
			rpc.getProfiles()
		}
		if (cycle % returnStateOn === 0) {
			rpc.refreshTargets()
		}
		cycle++
	}, cycleLength)
})

// view
log('Rendering Main')
import React from 'react'
import ReactDOM from 'react-dom'
import Main from './components/Main'

ReactDOM.render(
	<Provider store={store}>
		<Main />
	</Provider>,
	document.getElementById('root')
)
