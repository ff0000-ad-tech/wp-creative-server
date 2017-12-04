var shoe = require('shoe');
var dnode = require('dnode');

var d;

function connect() {
	const stream = shoe('/dnode');
	d = dnode();
	d.pipe(stream).pipe(d);
}

function getState(cb) {
	d.on('remote', function (remote) {
		remote.getState('targets', function (t) {
			state.targets = t;
			// --> react
			console.log(state.targets);
		});
	});
}

window.remote = this;
