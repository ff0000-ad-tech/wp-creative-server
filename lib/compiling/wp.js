const cmdEscape = require('@ff0000-ad-tech/cmd-escape')

const debug = require('@ff0000-ad-tech/debug')
var log = debug('wp-creative-server:lib:compiling:wp')

//
function prepareCmd(ctype, params) {
	const size = params.deploy.source.size
	const index = params.deploy.source.index
	// webpack settings
	const env = {
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
	var cmd = {
		command: 'npx',
		cmdArgs: ['webpack'],
		args: ['--config', 'webpack.config.js', '--env', JSON.stringify(env), '--colors'],
		cwd: global.servePath
	}

	// escape double-quotes and double-quote args to be compatible with winblows
	cmd.shell = cmd.exec = `cd "${cmd.cwd}" && ${cmd.command} ${cmdArgs.join(' ')} ${cmdEscape(cmd.args)}`

	return cmd
}

module.exports = {
	prepareCmd
}
