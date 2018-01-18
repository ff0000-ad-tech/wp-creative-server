import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import debug from 'debug'
const log = debug('wp-cs:app:SettingsEditor')

import './style.scss'

class SettingsEditor extends PureComponent {
	componentDidUpdate() {
		if (!this.props.show) {
			return null
		}
		var editor = ace.edit('editor')
		editor.setTheme('ace/theme/twilight')
		editor.session.setMode('ace/mode/javascript')
	}
	render() {
		if (!this.props.show) {
			return null
		}
		log(JSON.stringify(this.props.profiles[this.props.profileName], null, 2))
		return (
			<div className="backdrop">
				<div className="modal">
					<div className="profile-name">{this.props.profileName}</div>

					<pre id="editor">{JSON.stringify(this.props.profiles[this.props.profileName], null, 2)}</pre>

					<div className="footer">
						<button onClick={this.props.onClose}>Close</button>
					</div>
				</div>
			</div>
		)
	}
}

SettingsEditor.propTypes = {
	onClose: PropTypes.func.isRequired,
	profileName: PropTypes.string,
	show: PropTypes.bool
}

const mapStateToProps = function(state) {
	return {
		profiles: state.profiles
	}
}

export default connect(mapStateToProps)(SettingsEditor)
