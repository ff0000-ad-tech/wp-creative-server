# Webpack 4 Migration

## What would the migration affect?
- If one reinstalls the packaging dependencies from a project that still uses Webpack 3 and uses "latest" on the packaging dependencies, this will cause compiling to break, signaling a need to migrate
- Newly built ads would have different packaging dependencies but should still work independently of the Ad Framework dependencies

## Addressing ads breaking
If the watch process hangs for longer than 10 seconds, copy and run the watch command in a Terminal window. If an error that reads "Cannot read property 'watchRun' of undefined" shows up that prevents the compiling process from continuing, that means that your packaging is out of date.

Go ahead and:
1. Update ES6 Packaging
2. Delete the current `node_modules` folder and `package-lock.json` file
3. Reinstall dependencies with `npm install`

These steps should get you in sync with the updated packaging dependencies.

## What do we need to do?
- merge Webpack 4 changes to master, bump major versions of Deploy Manager and Webpack plugins, AND update deployed build sources
- Start using updating semver versions in packaging package.json to better avoid breaking changes in the future
- Let devs know that we've updated to Webpack 4
- Prepare for any older ads using Webpack 3 breaking when reinstalling
- Put in fallback, if possible - does not seem feasible, using Webpack 4 FAT plugins with Webpack 3 fallbacks causes the compilation to end at the build assets copying w/o throwing an error
