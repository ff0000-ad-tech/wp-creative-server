import { createStore, applyMiddleware, combineReducers } from 'redux'

import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'

import { creative } from './services/creative/reducers.js'
import { targets } from './services/targets/reducers.js'
import { profiles, sorted } from './services/profiles/reducers.js'

import debug from 'debug'
const log = debug('wp-cs:app:store')

const rootReducer = combineReducers({
	creative,
	targets,
	profiles,
	sorted
})

const loggerMiddleware = createLogger()

export default function configureStore(initialState) {
	log('configureStore()')
	return createStore(rootReducer, initialState, applyMiddleware(thunkMiddleware)) //, loggerMiddleware))
}
