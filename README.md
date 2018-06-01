##### RED Interactive Agency - Ad Technology
[![GitHub release](https://img.shields.io/github/release/ff0000-ad-tech%2Fwp-creative-server.svg?style=flat-square)](https://github.com/ff0000-ad-tech/wp-creative-server/releases/)
[![npm downloads](https://img.shields.io/npm/dm/@ff0000-ad-tech%2Fwp-creative-server.svg?style=flat-square)](https://www.npmjs.com/package/@ff0000-ad-tech%2Fwp-creative-server)
[![GitHub commit-activity](https://img.shields.io/github/commit-activity/y/ff0000-ad-tech/wp-creative-server.svg?style=flat-square)](https://github.com/ff0000-ad-tech/wp-creative-server)
[![GitHub contributors](https://img.shields.io/github/contributors/ff0000-ad-tech/wp-creative-server.svg?style=flat-square)](https://github.com/ff0000-ad-tech/wp-creative-server/graphs/contributors/)
[![npm license](https://img.shields.io/npm/l/@ff0000-ad-tech%2Fwp-creative-server.svg?style=flat-square)](https://github.com/ff0000-ad-tech/wp-creative-server/blob/master/LICENSE)

# Webpack - Creative Server

Configurable interface designed to simplify the process of building properly packaged, highly optimized, technically respectable banner campaigns.

## Dashboard

Utilize Webpack in a browser interface for ES6 banner development:

![Creative Server](https://github.com/ff0000-ad-tech/readme-assets/blob/master/wp-creative-server/full-app.png)

* many sizes, many indexes
* non-redundant, modular builds
* watch states per size/index, optionally concurrent
* debug & production bundles

![Dashboard](https://github.com/ff0000-ad-tech/readme-assets/blob/master/wp-creative-server/dashboard.png)

## Deploy Profiles

Manage deploy-profiles, Webpack settings, and any other collection data:

![Deploy Profile Settings](https://github.com/ff0000-ad-tech/readme-assets/blob/master/wp-creative-server/deploy-profile-settings.png)

## Browser

Enable navigation of assets/outputs:

![Browser](https://github.com/ff0000-ad-tech/readme-assets/blob/master/wp-creative-server/browser.png)

* Open files in associated editor app
* Open directories in system file manager

## Preview

Provide a localhost for quickly testing builds:

![Preview](https://github.com/ff0000-ad-tech/readme-assets/blob/master/wp-creative-server/preview.png)

* Run compiled units in browser
* Easily refresh
* Open units in a stand-alone tab for measuring k-weight

## Plugins

Plugin architecture for running additional, custom processes.

## Technical Overview

The Webpack scripts are independent of Creative Server. They run as their own process & communicate with Creative Server's REST API via https://github.com/ff0000-ad-tech/wp-process-manager. Otherwise, Creative Server data is a proxy of the file-system, the only source of truth. Persistant state is maintained by `profile.json`, `plugins.json`, and the like. Said state is then acquired by the Express/NodeJS runtime and is made available to the React/Redux view via RPC, on-demand, providing low-latency indication of:

1.  available sizes/indexes
2.  deploy profiles
3.  busy-state
4.  error-state
5.  last conpile time
6.  a view of the project file-system

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
## RECOMMENDED
We recommend you start with a full, working project template. For example, our ["Standard Base"](https://github.com/ff0000-ad-tech/tmpl-standard-base/blob/master/README.md). Once you have a feel for the eco-system, adapt CS as needed to your process.

# Usage

To launch Creative Server:

`node ./node_modules/\@ff0000-ad-tech/wp-creative-server/index.js --context ./`

It is recommended that you add a script to your project `package.json` to make starting CS easy:

```
...
"scripts": {
	"server": "node ./node_modules/@ff0000-ad-tech/wp-creative-server/index.js --context ./"
}
...
```

Then you can launch with:

`npm run server`

### Size Targets

Sizes will be discovered in `./[context]/['1-build']/...` on folder-names that match `/[0-9]+x[0-9]+/`.

### Index Targets

Indexes will be discovered in `./[context]/['1-build']/[size]/...` on file-names that match `/index/`.

# Plugins

#### Declaring a Plugin

Add a `./plugins.json` at your `--context` location. It will contain an object with NPM-style dependencies, like:

```
{
	"ad-es6-particles": "git+ssh://git@stash.ff0000.com:7999/at/ad-es6-particles.git",
	"@ff0000-ad-tech/cs-plugin-bulk-compile": "git+ssh://git@github.com:ff0000-ad-tech/cs-plugin-bulk-compile.git",
	"@ff0000-ad-tech/cs-plugin-vendor-indexes": "git+ssh://git@github.com:ff0000-ad-tech/cs-plugin-vendor-indexes.git"
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
