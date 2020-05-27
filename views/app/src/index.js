import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import configureStore from './store.js'

import debug from '@ff0000-ad-tech/debug'
const log = debug('wp-cs:app:index')

// create redux store
let store = configureStore({
	appMeta: {},
	plugins: null,
	creative: {},
	targets: {},
	profiles: {}
})

// server connection
import Backend from './lib/backend.js'
let backend = new Backend({
	store: store
})
// backend.connect(() => {
backend.getAppMeta()
backend.getPlugins()
backend.getCreative()
backend.readTargets()
backend.getProfiles()
backend.refreshTargets()

// update cycle
let cycle = 0
const readFsOn = 20
const readPackageOn = 7
const returnStateOn = 2
const cycleLength = 500 // milliseconds
setInterval(() => {
	if (cycle % readFsOn === 0) {
		backend.readTargets()
	}
	if (cycle % readPackageOn === 0) {
		backend.getProfiles()
	}
	if (cycle % returnStateOn === 0) {
		backend.refreshTargets()
	}
	cycle++
}, cycleLength)
// })

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
