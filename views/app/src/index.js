import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Main';

// React State
let state = {};


// server connection
import dnode from 'dnode';
import net from 'net';

// rpc
const d = dnode();
d.on('remote', function (remote) {
	remote.getState('targets', function (t) {
		state.targets = t;
		// --> react
		console.log(state.targets);
	});
});
var c = net.connect(5004);
c.pipe(d).pipe(c);


// view
ReactDOM.render(
	<Main/>, 
	document.getElementById('root')
);