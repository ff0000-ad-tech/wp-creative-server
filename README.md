##### RED Interactive Agency - Ad Technology

Webpack - Creative Server
=============== 
### Webpack
Implements Webpack in a browser interface for banner development.
- 1-size-to-many-index paradigm
- watch states for each, optionally concurrent
- unique production bundles for each

The spawned webpack scripts are connected to the reactive view over an RPC pipe of the stdout/stderr of each script, providing low-latency indication of 1) busy-state, 2) error-state, 3) last update time, and 4) a link to run the command in a shell manually. 

### Creative Server
Enables navigation & preview of assets/outputs.
- Run compiled units in browser
- Open any path in associated editor app
- Link any path out to the system file manager

# Install
`npm install --save-dev git://github.com/ff0000-ad-tech/wp-creative-server.git`

# Usage
`npm run server --context ./ --src build --webpack ./webpack.config.js --env '[src]/[size]/[index]_settings.json'`

- `context` base path for subpathing, and root path of the browser directory.
- `src` path to a directory containing size folders.
- `webpack` path to webpack config, optionally unique-per-index.
- `env` path to specific compile settings, likely unique-per-index.

#### Size Folders
Will match any folder in `[context]/[src]` like `/[0-9]+x[0-9]+/`.

#### Index Targets
Will match any file in `[context]/[src]/[size]` like `/index/`.


# Some Reasons
## Banner Production Tech Challenges
Ad Creative are generated on a campaign-by-campaign basis. Their characteristics:
 - any number of sizes/formats (ex. 970x250 YouTube Masthead, 300x250 DCM Standard, 2x1 IAB Standard)
 - a similar "look and feel"
 - able to advance their state (data & creative) across all units
 
#### Code Redundancy
Similarly executing code can be centralized, leaving only functions specific to a particular ad with that unit - the beauty of modularity! But the setup to achieve this are opinionated, ranging from cognitive overload, to creative restriction, to undue repetition...etc, ad nauseum.

#### Optimization & Performance
Ads must run across all devices, platforms, systems, containers. This is a hostile, untestable, restricted environment in which the unit will need to run, easily, several hundred million impressions over its flight of a couple days (or much longer).

#### Budget & Timing
Despite expectations on par with longer-lived applications, the reality does not afford ROI on campaign-spanning infrastructure.

#### Recycling & Migration
_Can't this all be automated??_ Yes, except for the previous points, plus one destructive edit: The underlying technology (HTML, CSS, Javascript) is evolving daily. This makes for yet more reasonable reluctance on the part of financiers, for the unlikelihood that the investment will live up to its promise, by the time it is finished.

## Open Source


