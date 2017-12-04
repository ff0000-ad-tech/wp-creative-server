import React, { Component } from 'react'
import CreativePanel from './CreativePanel'
import DirectoryPanel from './DirectoryPanel'
import DragBar from './DragBar'

import './style.scss'

class Creatives extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

  render() {
    return (
      <div className='page creatives'>
      	<CreativePanel />
      	<DragBar />
      	<DirectoryPanel />
      </div>
    )
  }
}
 
export default Creatives