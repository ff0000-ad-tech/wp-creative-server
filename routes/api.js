const fs = require('fs')
const path = require('path')
const open = require('open')

const mw = require('./middleware.js')

const backendApi = require('./backend-api.js')
const state = require('../lib/state.js')
const targets = require('../lib/targets.js')
const watching = require('../lib/compiling/watching.js')
const background = require('../lib/compiling/background.js')

const pkg = require('../package.json')
const plugins = require('../lib/plugins.js')
const clipboardy = require('clipboardy')
const profiles = require('../lib/profiles.js')

const debug = require('@ff0000-ad-tech/debug')
var log = debug('wp-creative-server:route:api')
const mLog = (...args) => {
	log(...args)
}

module.exports = (app, express) => {
	var routes = {
		TODO: 'Document API routes',
		getAppMeta: '/api/get-app-meta',
		getPlugins: '/api/get-plugins',
		getCreative: '/api/get-creative',
		readTargets: '/api/read-targets',
		refreshTargets: '/api/refresh-targets',
		copyWpCmd: '/api/copy-wp-cmd',
		getProfiles: '/api/get-profiles',
		newProfile: '/api/new-profile',
		updateProfile: '/api/update-profile',
		deleteProfile: '/api/delete-profile',
		addDeployTargets: '/api/add-deploy-targets',
		removeDeployTargets: '/api/remove-deploy-targets',
		copyPluginInstallCmd: '/api/copy-plugin-install-cmd'
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
		backendApi.api.getTargets(targets => {
			res.setHeader('Content-Type', 'application/json')
			res.send(JSON.stringify(targets))
		})
	})

	// get webpack command
	app.get('/api/get-wp-cmd/:type/:size/:index', [mw.markActivity], (req, res) => {
		mLog(req.url)
		const cmd = watching.getWpCmd(targets, req.params.type, req.params.size, req.params.index)
		if (cmd instanceof Error) {
			res.status(500).send({ error: cmd.message })
		} else {
			res.status(200).send(cmd)
		}
	})

	// watching - called by wp-process-manager
	app.get('/api/watch-start/:type/:size/:index/:pid', [mw.markActivity], (req, res) => {
		mLog(req.url)
		const target = state.getTargets(targets.generateId(req.params.size, req.params.index))
		watching.startWatching(req.params.type, target, req.params.pid)
		res.sendStatus(200)
	})
	app.get('/api/watch-stop/:type/:size/:index/:pid', [mw.markActivity], (req, res) => {
		mLog(req.url)
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
		mLog(req.url)
		const target = state.getTargets(targets.generateId(req.params.size, req.params.index))
		background.compile(req.params.type, target)
		res.sendStatus(200)
	})
	app.get('/api/compile-stop/:type/:size/:index', [mw.markActivity], (req, res) => {
		mLog(req.url)
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
		mLog(req.url)
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

	/* -- APP META -------------------------
	 *
	 *
	 *
	 */
	// get App Meta
	app.get('/api/get-app-meta', (req, res) => {
		mLog('/api/get-app-meta')
		backendApi.api.getAppMeta(resp => {
			if (resp instanceof Error) {
				res.status(500).send({ error: resp.message })
			} else {
				res.status(200).send(resp)
			}
		})
	})

	/* -- PLUGINS -------------------------
	 *
	 *
	 *
	 */
	// get plugins
	app.get('/api/get-plugins', (req, res) => {
		mLog('/api/get-plugins')
		backendApi.api.getPlugins(resp => {
			if (resp instanceof Error) {
				res.status(500).send({ error: resp.message })
			} else {
				res.status(200).send(resp)
			}
		})
	})

	app.post('/api/copy-plugin-install-cmd', (req, res) => {
		const body = req.body
		backendApi.api.copyPluginInstallCmd(body.plugin, resp => {
			if (resp instanceof Error) {
				res.status(500).send({ error: resp.message })
			} else {
				res.status(200).send(resp)
			}
		})
	})

	/* -- CREATIVE -------------------------
	 *
	 *
	 *
	 */
	app.get('/api/get-creative', (req, res) => {
		// mLog('/api/get-creative')
		backendApi.api.getCreative(resp => {
			if (resp instanceof Error) {
				res.status(500).send({ error: resp.message })
			} else {
				res.status(200).send(resp)
			}
		})
	})

	/* -- TARGETS -------------------------
	 *
	 *
	 *
	 */
	app.get('/api/read-targets', (req, res) => {
		// mLog('/api/read-targets')
		backendApi.api.readTargets(resp => {
			if (resp instanceof Error) {
				res.status(500).send({ error: resp.message })
			} else {
				res.status(200).send(resp)
			}
		})
	})

	app.get('/api/refresh-targets', (req, res) => {
		// mLog('/api/refresh-targets')
		backendApi.api.refreshTargets(resp => {
			if (resp instanceof Error) {
				res.status(500).send({ error: resp.message })
			} else {
				res.status(200).send(resp)
			}
		})
	})

	/* -- COMPILING -------------------------
	 *
	 *
	 *
	 */
	app.post('/api/copy-wp-cmd', (req, res) => {
		// mLog('/api/copy-wp-cmd')
		const body = req.body
		backendApi.api.copyWpCmd(body.type, body.size, body.index, resp => {
			if (resp instanceof Error) {
				res.status(500).send({ error: resp.message })
			} else {
				res.status(200).send(resp)
			}
		})
	})

	/* -- PROFILES -------------------------
	 *
	 *
	 *
	 */
	app.get('/api/get-profiles', (req, res) => {
		// mLog('/api/get-profiles')
		backendApi.api.getProfiles(
			resp => {
				res.status(200).send(resp)
			},
			err => {
				res.status(500).send({ err: resp.message })
			}
		)
	})

	app.post('/api/new-profile', (req, res) => {
		const body = req.body
		backendApi.api.newProfile(
			body.name,
			resp => {
				res.status(200).send(resp)
			},
			err => {
				res.status(500).send({ err: resp.message })
			}
		)
	})

	app.post('/api/update-profile', (req, res) => {
		const body = req.body
		backendApi.api.updateProfile(
			body.name,
			body.profile,
			resp => {
				res.status(200).send(resp)
			},
			err => {
				res.status(500).send({ err: resp.message })
			}
		)
	})

	app.post('/api/delete-profile', (req, res) => {
		const body = req.body
		backendApi.api.deleteProfile(
			body.name,
			resp => {
				res.status(200).send(resp)
			},
			err => {
				res.status(500).send({ err: resp.message })
			}
		)
	})

	app.post('/api/add-deploy-targets', (req, res) => {
		const body = req.body
		backendApi.api.addDeployTargets(
			body.name,
			body.target,
			resp => {
				res.status(200).send(resp)
			},
			err => {
				res.status(500).send({ err: resp.message })
			}
		)
	})

	app.post('/api/remove-deploy-targets', (req, res) => {
		const body = req.body
		backendApi.api.removeDeployTargets(
			body.name,
			body.target,
			resp => {
				res.status(200).send(resp)
			},
			err => {
				res.status(500).send({ err: resp.message })
			}
		)
	})

	// SHUTDOWN CREATIVE SERVER
	app.get('/api/exit', [mw.markActivity], (req, res) => {
		res.send('This instance of Creative Server has been shut down.')
		process.exit()
	})
}
