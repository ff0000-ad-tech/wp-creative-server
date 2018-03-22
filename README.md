##### RED Interactive Agency - Ad Technology

# Webpack - Creative Server

Implements Webpack in a browser interface for ES6 banner development.

* many sizes, many indexes
* non-redundant, modular builds
* watch states per size/index, optionally concurrent
* debug & production bundles
* save-able deploy profiles

Enables navigation & preview of assets/outputs.

* Run compiled units in browser
* Open files in associated editor app
* Open directories in system file manager

Plugin architecture for running additional, custom processes.

The Webpack scripts are independent of Creative Server. They communicate with Creative Server's REST API via https://github.com/ff0000-ad-tech/wp-process-manager. Creative Server data is maintained only by ExpressJS runtime in the backend. State is made available to the React/Redux view via RPC, providing lowest-latency indication of:

1.  busy-state
2.  error-state
3.  last update time
4.  a link to run the command in a shell manually

# Install

Creative Server can be installed in your banner project. CS expects the following hierarchy:

```
. Project Context
├── 1-build
| ├── 300x250
| | ├── index.html
| | └── ...
| ├── 320x50
| | ├── index.html
| | └── ...
| └── ...
|
├── 2-debug
| └── ...
|
├── 3-traffic
| └── ...
|
├── package.json
├── plugins.json
├── webpack.config.js
└── ...
```

`npm install --save-dev @ff0000-ad-tech/wp-creative-server.git`

Installing adds the following to your project:

```
├── node_modules
| └── @ff0000-ad-tech
|  └── wp-creative-server
|   ├── index.js
|   └── ...
```

# Usage

`node ./node_modules/\@ff0000-ad-tech/wp-creative-server/index.js --context ./`

It is recommended that you add a script to your project `package.json` to make starting CS easy:

```
...
"scripts": {
	"server": "node ./node_modules/@ff0000-ad-tech/wp-creative-server/index.js --context ./"
}
...
```

### Size Targets

Will match any folder in `[context]/['1-build']` like `/[0-9]+x[0-9]+/`.

### Index Targets

Will match any file in `[context]/['1-build']/[size]` like `/index/`.

# Plugins

#### Declaring a Plugin

Add a `./plugins.json` at your `--context` location. It will contain an object with NPM-style dependencies, like:

```
{
	"ad-es6-particles": "git+ssh://git@stash.ff0000.com:7999/at/ad-es6-particles.git",
	"argparse": "0.0.1"
}
```

#### Writing a Plugin

A plugin can be a frontend tool that runs in the browser ("app" style plugin) and makes calls to a system-level backend. Or it can simply hook into various UI elements
in the app and spawn system-level operations ("api" style plugin).

To make your plugin compatible, the following object must be added to your plugin's `package.json`:

```
	"name": "ad-es6-particles", // standard NPM name
	...
	"wp-creative-server": {
		"routes": {
			"app": "/dist", // route to the directory in your plugin that will be served as the app root
			"api": "/lib/api.js" // route to the Node script in your plugin that will be used as the API endpoint
		},
		"hooks": {
			"size-control": {
				"Particle Simulator": "/app/index.html" // the query to either "/app/" or "api", plus whatever static paths & params are needed
			}
		}
	}
```

##### Plugin Routes

Once a plugin is installed in your `--context`'s `node_modules`, Creative Server will create several routes, based on the plugin's `package.json`.
These will be available on the server like:

```
http://10.0.7.126:5200/ad-es6-particles
```

All plugin routes are sent the following:

* `api` - Creative Server endpoint URL
* `folders.build` - name of the build folder
* `folders.debug` - name of the debug folder
* `folders.traffic` - name of the traffic folder

##### Plugin Hooks

Hooks are various UI-elements in Creative Server to which plugins can be attributed. Depending on the hook, additional data is passed.

Currently available hooks are:

1.  `size-control` - your command will appear in a menu next to each ad-size. It will be passed:

* `size` - the requested size-folder name.

2.  `bulk-control` - your command will appear in a drop-down that will execute when the 🔥 is clicked. It will be passed:

* `profile` - name of the currently selected deploy profile (also the folder to which traffic-compiled ads are output)
* `targets` - an object with keys specifying paths to traffic-compiled output folders

# CS Frontend Development

To compile the React/Redux/ES6 frontend:

1.  Install all of the dev-dependencies.
2.  Run `npm run build`
