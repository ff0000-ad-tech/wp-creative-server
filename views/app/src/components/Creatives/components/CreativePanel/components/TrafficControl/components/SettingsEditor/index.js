import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import debug from 'debug'
const log = debug('wp-cs:app:SettingsEditor')

import './style.scss'

class SettingsEditor extends Component {
	shouldComponentUpdate() {
		return this.props.show ? false : true
	}
	componentDidUpdate() {
		if (!this.props.show) {
			return null
		}
		this.editor = ace.edit('editor')
		this.editor.$blockScrolling = Infinity
		this.editor.setTheme('ace/theme/monokai')
		this.editor.setShowPrintMargin(false);
		this.editor.session.setMode('ace/mode/javascript')
		this.editor.commands.addCommand({
			name: 'save',
			bindKey: { win: 'Ctrl-S', mac: 'Cmd-S' },
			exec: editor => {
				this.saveRequested()
			}
		})
		this.editor.session.setValue(JSON.stringify(this.props.currentProfile.profile, null, 2))
	}
	render() {
		if (!this.props.show) {
			return null
		}
		// log(JSON.stringify(this.props.currentProfile.profile, null, 2))
		return (
			<div className="backdrop">
				<div className="modal">
					<div className="header clear-after">
						<div className="title left">Deploy Profile - Settings</div>
						<div className="right">
							<input type="button" onClick={this.closeRequested} value="X" />
						</div>
					</div>
					<hr />

					<div className="profile-title clear-after">
						<div className="name left">{this.props.currentProfile.name}</div>
						<div className="delete left" onClick={this.props.onDelete}>
							<u>delete</u>
						</div>
					</div>
					<pre id="editor" />

					<div className="control">
						<div className="buttons clear-after">
							<input className="left" type="button" value="SAVE" onClick={this.saveRequested} />
						</div>
					</div>
					<hr />
				</div>
			</div>
		)
	}

	closeRequested = () => {
		this.props.onClose()
		this.forceUpdate()
	}

	saveRequested = () => {
		const code = this.editor.session.getValue()
		try {
			this.props.onSave(JSON.parse(code))
		} catch (err) {
			alert(err)
		}
	}
}

SettingsEditor.propTypes = {
	onSave: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	currentProfile: PropTypes.object.isRequired,
	show: PropTypes.bool
}

const mapStateToProps = function(state) {
	return {
		profiles: state.profiles
	}
}

export default connect(mapStateToProps)(SettingsEditor)
