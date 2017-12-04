import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Main';

import * as control from './lib/control.js';


// initial state
let state = {};


// server connection (connect-remote included via bundle)
window.connectRemote((err, remote) => {
	if (err) {
		throw('Unable to connect-remote!');
	}
	control.init({
		remote: remote,
		state: state
	});
	control.startUpdates();
});


// view
ReactDOM.render(
	<Main/>, 
	document.getElementById('root')
);