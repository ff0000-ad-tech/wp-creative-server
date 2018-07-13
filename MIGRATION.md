# Webpack 4 Migration

## What would the migration affect?
- If one reinstalls the packaging dependencies from a project that still uses Webpack 3 and uses "latest" on the packaging dependencies, this will cause compiling to break, signaling a need to migrate
- Newly built ads would have different packaging dependencies but should still work independently of the Ad Framework dependencies

## What do we need to do?
- merge Webpack 4 changes to master, bump major versions of Deploy Manager and Webpack plugins, AND update deployed build sources
- Start using updating semver versions in packaging package.json to better avoid breaking changes in the future
- Let devs know that we've updated to Webpack 4
- Prepare for any older ads using Webpack 3 breaking when reinstalling
- Put in fallback, if possible - does not seem feasible, using Webpack 4 FAT plugins with Webpack 3 fallbacks causes the compilation to end at the build assets copying w/o throwing an error
