const fs = require('fs')
const path = require('path')
const argv = require('minimist')(process.argv.slice(2))
const moment = require('moment')

const utils = require('./utils.js')

const debug = require('debug')
const log = debug('wp-creative-server:lib:package-locks')

// paths
const pkgName = 'package-lock.json'
const topPkgName = 'package-lock__TOP.json'
const buildPkgName = 'package-lock__BUILD.json'

const bpPath = path.resolve(`${global.servePath}/_buildpoints`)
const pkgLockPath = path.resolve(`${bpPath}/package-locks`)

const topPkgPath = path.resolve(`${global.servePath}/${pkgName}`)
const topPkgPath_Backup = path.resolve(`${bpPath}/${topPkgName}`)

const buildPkgPath = path.resolve(`${global.servePath}/${utils.BUILD_FOLDER}/${pkgName}`)
const buildPkgPath_Backup = path.resolve(`${bpPath}/${buildPkgName}`)

function verifyPaths() {
	if (!fs.existsSync(bpPath)) {
		fs.mkdirSync(bpPath)
	}
	if (!fs.existsSync(pkgLockPath)) {
		fs.mkdirSync(pkgLockPath)
	}
	if (!loadTopPkg_Backup() || !loadBuildPkg_Backup()) {
		saveBackupPkgs(loadTopPkg(), loadBuildPkg())
	}
}

// load top packages
function loadTopPkg() {
	return require(topPkgPath)
}
function loadTopPkg_Backup() {
	if (fs.existsSync(topPkgPath_Backup)) {
		return require(topPkgPath_Backup)
	}
}

// load build packages
function loadBuildPkg() {
	return require(buildPkgPath)
}
function loadBuildPkg_Backup() {
	if (fs.existsSync(buildPkgPath_Backup)) {
		return require(buildPkgPath_Backup)
	}
}

// check to backup
function checkToBackupPkgs() {
	verifyPaths()

	const topPkg = loadTopPkg()
	const buildPkg = loadBuildPkg()

	const topPkg_Backup = loadTopPkg_Backup()
	const buildPkg_Backup = loadBuildPkg_Backup()

	if (topPkg.lockfileVersion > topPkg_Backup.lockfileVersion || buildPkg.lockfileVersion > buildPkg_Backup.lockfileVersion) {
		backupPkgs()
	}
}

// do the backup
function backupPkgs() {
	verifyPaths()

	const topPkg = loadTopPkg()
	const buildPkg = loadBuildPkg()

	const topPkg_Backup = loadTopPkg_Backup()
	const buildPkg_Backup = loadBuildPkg_Backup()

	const backupPath = path.resolve(`${pkgLockPath}/${moment().format('YYYYMMDD-HHmm')}`)
	if (!fs.existsSync(backupPath)) {
		fs.mkdirSync(backupPath)
	}
	// move last backups to archive
	fs.writeFileSync(`${backupPath}/${topPkgName}`, JSON.stringify(topPkg_Backup, null, 2))
	fs.writeFileSync(`${backupPath}/${buildPkgName}`, JSON.stringify(buildPkg_Backup, null, 2))

	// save new backups
	saveBackupPkgs(topPkg, buildPkg)
}

function saveBackupPkgs(topPkg_Backup, buildPkg_Backup) {
	log('creating backups of package-lock.json')
	fs.writeFileSync(`${bpPath}/${topPkgName}`, JSON.stringify(topPkg_Backup, null, 2))
	fs.writeFileSync(`${bpPath}/${buildPkgName}`, JSON.stringify(buildPkg_Backup, null, 2))
}


module.exports = {
	checkToBackupPkgs
}