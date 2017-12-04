import { UPDATE } from './actions.js'



export function targets(state = {}, action) {
	console.log(action);
  switch (action.type) {
    case UPDATE:
      return Object.assign({}, action.targets);
    default:
      return state
  }
}

