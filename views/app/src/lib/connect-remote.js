var shoe = require('shoe');
var dnode = require('dnode');

function connect(cb) {
	try {
		const stream = shoe('/dnode');
		const d = dnode();
		d.on('remote', function (remote) {
			cb(null, remote);
		});
		d.pipe(stream).pipe(d);
	}
	catch (err) {
		cb(err);
	}
}

window.connectRemote = connect;
