import { createStore, applyMiddleware, combineReducers } from 'redux'

import thunkMiddleware from 'redux-thunk'
// import { createLogger } from 'redux-logger'

import { appMeta } from './services/app-meta/reducers.js'
import { browser } from './services/browser/reducers.js'
import { plugins } from './services/plugins/reducers.js'
import { creative } from './services/creative/reducers.js'
import { targets } from './services/targets/reducers.js'
import { profiles, currentProfile } from './services/profiles/reducers.js'

import debug from '@ff0000-ad-tech/debug'
const log = debug('wp-cs:app:store')

const rootReducer = combineReducers({
	appMeta,
	browser,
	plugins,
	creative,
	targets,
	profiles,
	currentProfile
})

// let loggerMiddleware = createLogger()

export default function configureStore(initialState) {
	log('configureStore()')
	return createStore(
		rootReducer,
		initialState,
		// allows usage w/ Redux DevTools: https://github.com/zalmoxisus/redux-devtools-extension
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
		applyMiddleware(thunkMiddleware)
	)
	//, loggerMiddleware))
}
