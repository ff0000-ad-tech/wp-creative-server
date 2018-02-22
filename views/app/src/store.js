import { createStore, applyMiddleware, combineReducers } from 'redux'

import thunkMiddleware from 'redux-thunk'
// import { createLogger } from 'redux-logger'

import { browser } from './services/browser/reducers.js'
import { creative } from './services/creative/reducers.js'
import { targets } from './services/targets/reducers.js'
import { profiles, currentProfile } from './services/profiles/reducers.js'

import debug from 'debug'
const log = debug('wp-cs:app:store')

const rootReducer = combineReducers({
	browser,
	creative,
	targets,
	profiles,
	currentProfile
})

// let loggerMiddleware = createLogger()

export default function configureStore(initialState) {
	log('configureStore()')
	return createStore(rootReducer, initialState, applyMiddleware(thunkMiddleware)) //, loggerMiddleware))
}
