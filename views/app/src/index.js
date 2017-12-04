import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Main';

import '../public/remote.bundle.js';

// server connection
window.remote.connect();

// React State
let state = window.remote.getState();


// view
ReactDOM.render(
	<Main/>, 
	document.getElementById('root')
);