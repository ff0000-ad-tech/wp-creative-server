import { combineReducers } from 'redux'
import {
  UPDATE_TARGETS
} from './actions.js'



function targets(state = {}, action) {
  switch (action.type) {
    case UPDATE_TARGETS:
      return Object.assign({}, action.targets);
    default:
      return state
  }
}

const app = combineReducers({
  targets
})

export default app