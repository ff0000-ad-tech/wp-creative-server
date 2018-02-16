const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const moment = require('moment')
const { exec } = require('child_process')

const utils = require('./lib/utils.js')

// set app path
const packageJson = require('./package.json')
global.rootPath = path.resolve(__dirname + '/../../../')

const debug = require('debug');
const log = debug(packageJson.name + ':npm-helper');

if ('silence' in argv) {
  debug.disable(true);
}

// help
if (argv.help) {
  log(
    `CLI OPTIONS:\n` +
      `node ./lib/api.js\n` +
      `-------------------------------------------------------------------------------------------\n` +
      ` --cmd	API COMMAND, options include:\n` +
      `    "backup-packages"      save both "package-lock.json" files to "./_buildpoints" \n\n` +
      ` --silence, squelches console output\n` +
      `-------------------------------------------------------------------------------------------`
  );
  process.exit();
}

// api command
if (!('cmd' in argv)) {
  console.error('No API COMMAND (--cmd) specified');
  process.exit();
}

/* -- BACKUP ----
*
*		
*/
if (argv.cmd == 'backup-packages') {
	const bpPath = rootPath + '/_buildpoints'
	if (!fs.existsSync(bpPath)) {
		fs.mkdirSync(bpPath)
	}
	const backupPath = path.resolve(`${bpPath}/package-locks__${moment().format('YYYYMMDD-HHmm')}`)
	fs.mkdirSync(backupPath)

	const topPkgPath = path.resolve(`${rootPath}/package-lock.json`)
	exec(`cp "${topPkgPath}" "${backupPath}/package-lock__TOP.json"`)

	const buildPkgPath = path.resolve(`${rootPath}/${utils.BUILD_FOLDER}/package-lock.json`)
	exec(`cp "${buildPkgPath}" "${backupPath}/package-lock__BUILD.json"`)
}
