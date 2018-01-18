import { createStore, applyMiddleware, combineReducers } from 'redux'

import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'

import { creative as creativeReducers } from './services/creative/reducers.js'
import { targets as targetsReducers } from './services/targets/reducers.js'
import { profiles as profilesReducers } from './services/profiles/reducers.js'

import debug from 'debug'
const log = debug('wp-cs:store')

const rootReducer = combineReducers({
	creative: creativeReducers,
	targets: targetsReducers,
	profiles: profilesReducers
})

const loggerMiddleware = createLogger()

export default function configureStore(initialState) {
	return createStore(rootReducer, initialState, applyMiddleware(thunkMiddleware)) //, loggerMiddleware))
}
