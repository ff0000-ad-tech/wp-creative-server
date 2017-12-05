import React, { PureComponent } from 'react'

import debug from 'debug'
const log = debug('wp-cs:BrowsePanel')

import './style.scss'

class BrowsePanel extends PureComponent {
	render() {
		this.paths = this.getPaths(window.location.href);
		return (
			<div className="browse-panel">
				<iframe id="browse-iframe" src={`/${this.paths.browseRoute}`} onLoad={this.handleBrowse.bind(this)}></iframe>
			</div>
		)
	}

	getPaths(href) {
		const protocolDomainPort = href.match(/^.+?:\/\/.+?\//)[0]
		const appRoute = href.slice(protocolDomainPort.length).match(/.+?#\//)[0]
		const browseRoute = href.slice((protocolDomainPort + appRoute).length)
		return {
			protocolDomainPort,
			appRoute,
			browseRoute
		}
	}

	handleBrowse(e) {
		const location = e.target.contentWindow.location;
		const uri = location.href.replace(/^[^:]+:\/\/[^\/]+\//, '');
		log(uri);
		history.pushState({}, '', 'app#/' + uri);
	}
}

export default BrowsePanel