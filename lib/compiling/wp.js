const cmdEscape = require('@ff0000-ad-tech/cmd-escape')

const debug = require('@ff0000-ad-tech/debug')
var log = debug('wp-creative-server:lib:compiling:wp')

//
function prepareCmd(ctype, params) {
	const size = params.deploy.source.size
	const index = params.deploy.source.index
	// webpack settings
	const env = {
		scope: global.servePath,
		deploy: params.deploy,
		watch: {
			api: global.api,
			key: `/${ctype}/${size}/${index}`,
			watch: {
				start: `/watch-start`,
				stop: `/watch-stop`,
				complete: `/watch-complete`
			},
			processing: {
				start: `/processing-start`,
				stop: `/processing-stop`
			},
			error: {
				dispatch: `/error-dispatch`,
				reset: `/error-reset`
			}
		}
	}

	// webpack command
	const command = 'npx'
	const cmdArgs = ['webpack']
	const args = ['--config', `${global.wpDmPath}/webpack.config.js`, '--env', JSON.stringify(env), '--colors']

	// escape double-quotes and double-quote args to be compatible with winblows
	const shell = `cd "${global.cwd}" && ${command} ${cmdArgs.join(' ')} ${cmdEscape(args)}`

	return {
		command,
		args: cmdArgs.concat(args),
		cwd: global.cwd,
		shell,
		exec: shell
	}
}

module.exports = {
	prepareCmd
}
