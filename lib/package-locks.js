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
const topPkgPath_Backup = path.resolve(`${pkgLockPath}/${topPkgName}`)

const buildPkgPath = path.resolve(`${global.servePath}/${utils.BUILD_FOLDER}/${pkgName}`)
const buildPkgPath_Backup = path.resolve(`${pkgLockPath}/${buildPkgName}`)

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
	return fs.readFileSync(topPkgPath)
}
function loadTopPkg_Backup() {
	if (fs.existsSync(topPkgPath_Backup)) {
		return fs.readFileSync(topPkgPath_Backup)
	}
}

// load build packages
function loadBuildPkg() {
	return fs.readFileSync(buildPkgPath)
}
function loadBuildPkg_Backup() {
	if (fs.existsSync(buildPkgPath_Backup)) {
		return fs.readFileSync(buildPkgPath_Backup)
	}
}

// check to backup
function checkToBackupPkgs() {
	verifyPaths()

	const topPkg = loadTopPkg()
	const buildPkg = loadBuildPkg()

	const topPkg_Backup = loadTopPkg_Backup()
	const buildPkg_Backup = loadBuildPkg_Backup()

	if (!topPkg.equals(topPkg_Backup) || !buildPkg.equals(buildPkg_Backup)) {
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
	log(` Archiving previous top backup: ${backupPath}/${topPkgName}`)
	fs.writeFileSync(`${backupPath}/${topPkgName}`, topPkg_Backup)

	log(` Archiving previous build backup: ${backupPath}/${buildPkgName}`)
	fs.writeFileSync(`${backupPath}/${buildPkgName}`, buildPkg_Backup)

	// save new backups
	saveBackupPkgs(topPkg, buildPkg)
}

function saveBackupPkgs(topPkg_Backup, buildPkg_Backup) {
	log(` Saving new top backup: ${topPkgPath_Backup}`)
	fs.writeFileSync(`${topPkgPath_Backup}`, topPkg_Backup)

	log(` Saving new build backup: ${buildPkgPath_Backup}`)
	fs.writeFileSync(`${buildPkgPath_Backup}`, buildPkg_Backup)
}


module.exports = {
	checkToBackupPkgs
}