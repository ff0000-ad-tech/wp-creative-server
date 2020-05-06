const fs = require('fs')
const path = require('path')
const open = require('open')

const mw = require('./middleware.js')

const rpcApi = require('./rpc-api.js')
const state = require('../lib/state.js')
const targets = require('../lib/targets.js')
const watching = require('../lib/compiling/watching.js')
const background = require('../lib/compiling/background.js')

const pkg = require('../package.json')
const plugins = require('../lib/plugins.js')

const debug = require('@ff0000-ad-tech/debug')
var log = debug('wp-creative-server:route:api')

module.exports = (app, express) => {
	var routes = {
		TODO: 'Document API routes'
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
	app.get('/api', [mw.markActivity], (req, res) => {
		res.setHeader('Content-Type', 'application/json')
		res.send(JSON.stringify(routes))
	})

	// get targets
	app.get('/api/targets', [mw.markActivity], (req, res) => {
		rpcApi.api.getTargets(targets => {
			res.setHeader('Content-Type', 'application/json')
			res.send(JSON.stringify(targets))
		})
	})

	// get webpack command
	app.get('/api/get-wp-cmd/:type/:size/:index', [mw.markActivity], (req, res) => {
		log(req.url)
		const cmd = watching.getWpCmd(targets, req.params.type, req.params.size, req.params.index)
		if (cmd instanceof Error) {
			res.status(500).send({ error: cmd.message })
		} else {
			res.status(200).send(cmd)
		}
	})

	// watching - called by wp-process-manager
	app.get('/api/watch-start/:type/:size/:index/:pid', [mw.markActivity], (req, res) => {
		log(req.url)
		const target = state.getTargets(targets.generateId(req.params.size, req.params.index))
		watching.startWatching(req.params.type, target, req.params.pid)
		res.sendStatus(200)
	})
	app.get('/api/watch-stop/:type/:size/:index/:pid', [mw.markActivity], (req, res) => {
		log(req.url)
		const target = state.getTargets(targets.generateId(req.params.size, req.params.index))
		watching.stopWatching(req.params.type, target)
		res.sendStatus(200)
	})
	app.get('/api/watch-complete/:type/:size/:index', [mw.markActivity], (req, res) => {
		const target = state.getTargets(targets.generateId(req.params.size, req.params.index))
		watching.completeWatch(req.params.type, target)
		res.sendStatus(200)
	})

	// compiling - user requests from application
	app.get('/api/compile-start/:type/:size/:index', [mw.markActivity], (req, res) => {
		log(req.url)
		const target = state.getTargets(targets.generateId(req.params.size, req.params.index))
		background.compile(req.params.type, target)
		res.sendStatus(200)
	})
	app.get('/api/compile-stop/:type/:size/:index', [mw.markActivity], (req, res) => {
		log(req.url)
		const target = state.getTargets(targets.generateId(req.params.size, req.params.index))
		background.kill(req.params.type, target)
		res.sendStatus(200)
	})

	// processing - called by wp-process-manager
	app.get('/api/processing-start/:type/:size/:index', [mw.markActivity], (req, res) => {
		const target = state.getTargets(targets.generateId(req.params.size, req.params.index))
		watching.setProcessing(req.params.type, target, true)
		res.sendStatus(200)
	})
	app.get('/api/processing-stop/:type/:size/:index', [mw.markActivity], (req, res) => {
		const target = state.getTargets(targets.generateId(req.params.size, req.params.index))
		watching.setProcessing(req.params.type, target, false)
		res.sendStatus(200)
	})

	// error - called by wp-process-manager
	app.get('/api/error-dispatch/:type/:size/:index', [mw.markActivity], (req, res) => {
		log(req.url)
		const target = state.getTargets(targets.generateId(req.params.size, req.params.index))
		watching.setError(req.params.type, target, true)
		res.sendStatus(200)
	})
	app.get('/api/error-reset/:type/:size/:index', [mw.markActivity], (req, res) => {
		const target = state.getTargets(targets.generateId(req.params.size, req.params.index))
		watching.setError(req.params.type, target, false)
		res.sendStatus(200)
	})

	// open directory
	app.get('/api/open-directory', [mw.markActivity], (req, res) => {
		const target = decodeURIComponent(req.query.target)
		open(path.resolve(`${global.servePath}/${target}`))
		res.sendStatus(200)
	})

	// edit file
	app.get('/api/edit-file', [mw.markActivity], (req, res) => {
		const target = decodeURIComponent(req.query.target)
		open(path.resolve(`${global.servePath}/${target}`))
		res.sendStatus(200)
	})

	// get App Meta
	app.get('/api/get-app-meta', (req, res) => {
		log('api.js /api/get-app-meta')
		res.status(200).send({ version: pkg.version })
	})

	// get plugins
	app.get('/api/get-plugins', [mw.markActivity], (req, res) => {
		log('api.js /api/get-plugins')

		// get available plugins
		const available = plugins.getAvailable()
		log('		available', available)
		if (!available) {
			// return cb()
			res.status(200).send({})
		}

		// get installed plugins
		const installed = plugins.getInstalled(available)

		var out = {
			available,
			installed
		}
		// cb(out)

		// const target = decodeURIComponent(req.query.target)
		// open(path.resolve(`${global.servePath}/${target}`))
		res.status(200).send(out)
	})

	// SHUTDOWN CREATIVE SERVER
	app.get('/api/exit', [mw.markActivity], (req, res) => {
		res.send('This instance of Creative Server has been shut down.')
		process.exit()
	})
}
