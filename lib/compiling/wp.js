const unixPathLiteral = require('@ff0000-ad-tech/unix-path-literal')
const shellescape = require('shell-escape')
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
		command: 'npx webpack',
		args: ['--config', 'webpack.config.js', '--env', JSON.stringify(env), '--colors'],
		cwd: global.servePath
	}
	let cmdStr = `cd "${cmd.cwd}" &&`

	// windows formatted commands
	if (process.platform === 'win32') {
		cmd.shell = cmd.exec = `${cmdStr} ${cmd.command} ${cmdEscape(cmd.args)}`
	}
	// mac & linux formatted commands
	else {
		cmd.shell = cmd.exec = `${cmdStr} ${cmd.command} ${shellescape(cmd.args)}`
	}

	return cmd
}

module.exports = {
	prepareCmd
}
