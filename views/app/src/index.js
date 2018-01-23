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
	let fsRefreshCount = 0
	const fsRefreshAt = 15
	const pingInterval = 500 // milliseconds
	setInterval(() => {
		if (fsRefreshCount === fsRefreshAt) {
			// log('full refresh')
			rpc.getTargets()
			fsRefreshCount = 0
		} else {
			rpc.refreshTargets()
			fsRefreshCount++
		}
	}, pingInterval)
})

// view
log('Rendering Main')
import React from 'react'
import ReactDOM from 'react-dom'
import Main from './Main'

ReactDOM.render(
	<Provider store={store}>
		<Main />
	</Provider>,
	document.getElementById('root')
)
