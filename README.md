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

Plugin architecture for running additional processes

The spawned webpack scripts are connected to a Reactive view over an RPC pipe of the stdout/stderr of each script, providing low-latency indication of 1) busy-state, 2) error-state, 3) last update time, and 4) a link to run the command in a shell manually.

# Install

`npm install --save-dev git://github.com/ff0000-ad-tech/wp-creative-server.git`

# Usage

`npm run server --context ./`

Creative Server expects your banner project `--context` to be organized in the following way:

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

#### Size Targets

Will match any folder in `[context]/['1-build']` like `/[0-9]+x[0-9]+/`.

#### Index Targets

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
