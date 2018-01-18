import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Rpc from '../../../../lib/rpc.js'

import debug from 'debug'
const log = debug('wp-cs:app:SettingsEditor')

import './style.scss'

class SettingsEditor extends PureComponent {
	render() {
		// Render nothing if the "show" prop is false
		if (!this.props.show) {
			return null
		}

		// build ace editor
		var editor = ace.edit('editor')
		editor.setTheme('ace/theme/twilight')
		editor.session.setMode('ace/mode/javascript')

		return (
			<div className="backdrop">
				<div className="modal">
					<div className="profile-name">{this.props.name}</div>

					<pre id="editor">{this.props.json}</pre>

					<div className="footer">
						<button onClick={this.props.onClose}>Close</button>
					</div>
				</div>
			</div>
		)
	}
}

SettingsEditor.propTypes = {
	name: PropTypes.string.isRequired,
	json: PropTypes.object.isRequired,
	show: PropTypes.bool
}

const mapStateToProps = function(state) {
	return {
		profiles: state.profiles
	}
}

export default connect(mapStateToProps)(SettingsEditor)
