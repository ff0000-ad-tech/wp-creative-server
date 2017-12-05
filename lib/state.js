var _ = require('lodash');

const debug = require('debug');
var log = debug('wp-creative-server:lib:state');


var state = {
	targets: {}
};



function getTargets(ids) {
	ids = typeof ids == 'string' ? [ids] : ids;
	if (!ids) {
		return state.targets;
	}
	var targets = {};
	var hasTargets = false;
	ids.forEach((id) => {
		if (id in state.targets) {
			hasTargets = true;
			targets[id] = state.targets[id];
		}
	});
	return hasTargets ? targets : null;
}



function addTargets(targets) {
	var newTargets = {};
	for (var id in targets) {
		if (!getTargets(id)) {
			newTargets[id] = targets[id];
		}
	}
	state.targets = _.extend(
		state.targets,
		newTargets
	);
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
	updateTarget,
	addTargets
};

