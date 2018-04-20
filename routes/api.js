const fs = require('fs')
const path = require('path')
const open = require('open')

const rpcApi = require('./rpc-api.js')
const state = require('../lib/state.js')
const targets = require('../lib/targets.js')
const watching = require('../lib/compiling/watching.js')
const background = require('../lib/compiling/background.js')

const debug = require('@ff0000-ad-tech/debug')
var log = debug('wp-creative-server:route:api')

module.exports = (app, express) => {
	var routes = {
		description:
			'`/api` endpoint enables anybody with access to this Creative Server to manage the Webpack processes, for watching and deployment.',
		'/api': {
			description: 'Returns this document.',
			type: 'GET',
			params: []
		},
		// TODO: bring these up to date:
		//
		// '/api/start-watching': {
		// 	description: 'Starts a Webpack watch process on the specified build-size/-index.',
		// 	type: 'GET',
		// 	params: [
		// 		{
		// 			name: 'size',
		// 			description: 'Matches a folder in the `./build` that contains an ad index.'
		// 		},
		// 		{
		// 			name: 'index',
		// 			description: 'Matches a file in `./build/size/` that is an ad.'
		// 		}
		// 	]
		// },
		// '/api/stop-watching': {
		// 	description: 'If it exists, stops the Webpack watch process on the specified build-size/-index.',
		// 	type: 'GET',
		// 	params: [
		// 		{
		// 			name: 'size',
		// 			description: 'Matches a folder in the `./build` that contains an ad index.'
		// 		},
		// 		{
		// 			name: 'index',
		// 			description: 'Matches a file in `./build/size/` that is an ad.'
		// 		}
		// 	]
		// },
		'/api/open-directory': {
			description: 'Open the target in the file-system navigator.',
			type: 'GET',
			params: [
				{
					name: 'target',
					description: 'A path relative to the server context.'
				}
			]
		},
		'/api/edit-file': {
			description: 'Open the target in the application set to handle this type of file.',
			type: 'GET',
			params: [
				{
					name: 'target',
					description: 'A path relative to the server context.'
				}
			]
		}
	}

	/**
	 * VALIDATION
	 *
	 *
	 */
	function validateSize(size) {
		if (!size) {
			throw `Does not specify 'size'. Please see /api endpoint for more info.`
		}
		return size
	}
	function validateIndex(index) {
		if (!index) {
			throw `Does not specify 'index'. Please see /api endpoint for more info.`
		}
		return index
	}

	// get api routes
	app.get('/api', (req, res) => {
		res.setHeader('Content-Type', 'application/json')
		res.send(JSON.stringify(routes))
	})

	// get targets
	app.get('/api/targets', (req, res) => {
		rpcApi.api.getTargets(targets => {
			res.setHeader('Content-Type', 'application/json')
			res.send(JSON.stringify(targets))
		})
	})

	// watching - called by wp-process-manager
	app.get('/api/watch-start/:type/:size/:index/:pid', (req, res) => {
		log(req.url)
		const target = state.getTargets(targets.generateId(req.params.size, req.params.index))
		watching.startWatching(req.params.type, target, req.params.pid)
		res.sendStatus(200)
	})
	app.get('/api/watch-stop/:type/:size/:index/:pid', (req, res) => {
		log(req.url)
		const target = state.getTargets(targets.generateId(req.params.size, req.params.index))
		watching.stopWatching(req.params.type, target)
		res.sendStatus(200)
	})
	app.get('/api/watch-complete/:type/:size/:index', (req, res) => {
		const target = state.getTargets(targets.generateId(req.params.size, req.params.index))
		watching.completeWatch(req.params.type, target)
		res.sendStatus(200)
	})

	// compiling - user requests from application
	app.get('/api/compile-start/:type/:size/:index', (req, res) => {
		log(req.url)
		const target = state.getTargets(targets.generateId(req.params.size, req.params.index))
		background.compile(req.params.type, target)
		res.sendStatus(200)
	})
	app.get('/api/compile-stop/:type/:size/:index', (req, res) => {
		log(req.url)
		const target = state.getTargets(targets.generateId(req.params.size, req.params.index))
		background.kill(req.params.type, target)
		res.sendStatus(200)
	})

	// processing - called by wp-process-manager
	app.get('/api/processing-start/:type/:size/:index', (req, res) => {
		const target = state.getTargets(targets.generateId(req.params.size, req.params.index))
		watching.setProcessing(req.params.type, target, true)
		res.sendStatus(200)
	})
	app.get('/api/processing-stop/:type/:size/:index', (req, res) => {
		const target = state.getTargets(targets.generateId(req.params.size, req.params.index))
		watching.setProcessing(req.params.type, target, false)
		res.sendStatus(200)
	})

	// error - called by wp-process-manager
	app.get('/api/error-dispatch/:type/:size/:index', (req, res) => {
		log(req.url)
		const target = state.getTargets(targets.generateId(req.params.size, req.params.index))
		watching.setError(req.params.type, target, true)
		res.sendStatus(200)
	})
	app.get('/api/error-reset/:type/:size/:index', (req, res) => {
		const target = state.getTargets(targets.generateId(req.params.size, req.params.index))
		watching.setError(req.params.type, target, false)
		res.sendStatus(200)
	})

	// open directory
	app.get('/api/open-directory', (req, res) => {
		const target = decodeURIComponent(req.query.target)
		open(path.resolve(`${global.servePath}/${target}`))
		res.sendStatus(200)
	})

	// edit file
	app.get('/api/edit-file', (req, res) => {
		const target = decodeURIComponent(req.query.target)
		open(path.resolve(`${global.servePath}/${target}`))
		res.sendStatus(200)
	})
}
