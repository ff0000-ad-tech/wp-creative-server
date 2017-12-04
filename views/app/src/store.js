import { createStore, applyMiddleware, combineReducers } from 'redux'

import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'

import { targets } from './services/targets/reducers.js'


import debug from 'debug'
const log = debug('wp-cs:store')

const rootReducer = combineReducers({
	targets
})

const loggerMiddleware = createLogger()

export default function configureStore(initialState) {
	return createStore(
		rootReducer,
		initialState,
		applyMiddleware(
			thunkMiddleware,
			loggerMiddleware
		)
	)
}