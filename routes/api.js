const fs = require('fs');
const path = require('path');

const control = require('../controllers/control.js');

const debug = require('debug');
var log = debug('wp-creative-server:route:api');

module.exports = (app, express) => {

	var routes = {
		description: '`/api` endpoint enables anybody with access to this Creative Server to manage the Webpack processes, for watching and deployment.',
		'/api': {
			description: 'Returns this document.',
			type: 'GET',
			params: []
		}, 
		'/api/start-watching': {
			description: 'Starts a Webpack watch process on the specified build-size/-index.',
			type: 'GET',
			params: [{
				name: 'size',
				description: 'Matches a folder in the `./build` that contains an ad index.'
			},{
				name: 'index',
				description: 'Matches a file in `./build/size/` that is an ad.'
			}]
		}, 
		'/api/stop-watching': {
			description: 'If it exists, stops the Webpack watch process on the specified build-size/-index.',
			type: 'GET',
			params: [{
				name: 'size',
				description: 'Matches a folder in the `./build` that contains an ad index.'
			},{
				name: 'index',
				description: 'Matches a file in `./build/size/` that is an ad.'
			}]
		}
	}

	/* -- CONTROL -----------------------------------
	 *
	 *
	 *
	 */
	app.get('/api', (req, res) => {
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(routes));
	});


	// start watching: size / index
	app.get('/api/start-watching', (req, res) => {
		validateSize(req.query.size);
		validateIndex(req.query.index); 
		//
		control.startWatching(
			req.query.size, 
			req.query.index
		);
		res.redirect('/control');
	});

	// stop watching: size / index
	app.get('/api/stop-watching', (req, res) => {
		validateSize(req.query.size);
		validateIndex(req.query.index); 
		//
		control.startWatching(
			req.query.size, 
			req.query.index
		);
		res.redirect('/control');
	});



	function validateSize(size) {
		if (!size) {
			throw(`Does not specify 'size'. Please see /api endpoint for more info.`);
		}
	}
	function validateIndex(index) {
		if (!index) {
			throw(`Does not specify 'index'. Please see /api endpoint for more info.`);
		}	
	}

};