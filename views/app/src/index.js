import { createStore, combineReducers } from 'redux'
import configureStore from './store.js'

import debug from 'debug'
const log = debug('wp-cs:index')

// create redux store
log('Configuring Redux Store')
let store = configureStore({
	targets: {}
})


// server connection
log('Connecting Server RPC')
import * as rpc from './lib/rpc.js'
rpc.init({
	store: store
})
rpc.connect()


// view
log('Rendering Main')
import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Main';

ReactDOM.render(
	<Main/>, 
	document.getElementById('root')
);