const unixPathLiteral = require('@ff0000-ad-tech/unix-path-literal')
const shellescape = require('shell-escape')

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
		args: ['webpack', '--config', 'webpack.config.js', '--env', JSON.stringify(env), '--colors'],
		cwd: global.servePath
	}

	// windows formatted commands
	if (process.platform === 'win32') {
		const args = cmd.args.map(arg => {
			if (!arg.match(/^--/)) {
				arg = arg.replace(/"/g, '\\"')
				return `"${arg}"`
			} else {
				return arg
			}
		})
		cmd.shell = cmd.exec = `cd "${cmd.cwd}" && ${cmd.command} ${args.join(' ')}`
	} 

	// mac & linux formatted commands
	else {
		// shell command (for copy-and-paste)
		cmd.shell = `cd ${unixPathLiteral(cmd.cwd)} && ${cmd.command} ${shellescape(cmd.args)}`

		// exec command (for spawning process)
		cmd.exec = `cd ${cmd.cwd} && ${cmd.command} ${shellescape(cmd.args)}`
	}


	return cmd
}

module.exports = {
	prepareCmd
}
