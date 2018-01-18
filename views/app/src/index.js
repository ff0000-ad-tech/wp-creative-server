import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import configureStore from './store.js'

import debug from 'debug'
const log = debug('wp-cs:app:index')

// create redux store
log('Configuring Redux Store')
let store = configureStore({
	creative: {},
	targets: {},
	profiles: {}
})

// server connection
log('Connecting Server RPC')
import * as rpc from './lib/rpc.js'
rpc.init({
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
	setInterval(() => {
		rpc.getTargets()
	}, 1000)
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
