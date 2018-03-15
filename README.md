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

`npm run server --context ./ --src build --webpack ./webpack.config.js --env '[src]/[size]/[index]_settings.json'`

* `context` base path for subpathing, and root path of the browser directory.
* `src` path to a directory containing size folders.
* `webpack` path to webpack config, optionally unique-per-index.
* `env` path to specific compile settings, likely unique-per-index.

#### Size Folders

Will match any folder in `[context]/[src]` like `/[0-9]+x[0-9]+/`.

#### Index Targets

Will match any file in `[context]/[src]/[size]` like `/index/`.

# Plugins

Add a `./plugins.json` at your `--context` location. It will contain an object with NPM-style dependencies, like:

```
{
	"ad-es6-particles": "git+ssh://git@stash.ff0000.com:7999/at/ad-es6-particles.git",
	"argparse": "0.0.1"
}
```

## Plugin Routes

Once these are installed in your `--context`'s `node_modules`, Creative Server will create several routes, based on the plugin's `package.json`.
These will be available on the server like:

```
http://10.0.7.126:5200/ad-es6-particles
```

#### main

`package.json -> main` describes a path, normally to `index.js`. Creative Server will statically serve that directory. So your plugin should have
an `index.html` at that location that runs your frontend.

#### api

If `package.json -> api` has a valid path to a node.js file, Creative Server will execute api requests to it, like:

```
http://10.0.7.126:5200/ad-es6-particles/api/?arg=value&arg2=value
```

executes:

```
node '/Users/greg.connell/Documents/_CLIENTS/_AD_APP_TESTING/RED_Dev/ES6/mar13/node_modules/ad-es6-particles/./lib/api.js' --arg value --arg2 value
```

This gives your plugin full access to the filesystem, to do whatever you need to do.
