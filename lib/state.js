var _ = require('lodash');

const debug = require('debug');
var log = debug('wp-creative-server:lib:state');


var state = {
	watching: []
};



function getTargets() {
	return state.watching;
}

function getTarget(id) {
	return state.watching[id];
}

function addTarget(target) {
	if (!getTarget(target.id)) {
		state.watching.push(target);
	}
}

function updateTarget(target, state) {
	log('updateTarget()');
	log(' - previous state:');
	log(target);
	target = _.merge(target, state);
	log(' - current state:');
	log(target);
}




module.exports = {
	getTargets,
	getTarget,
	updateTarget,
	addTarget
};

