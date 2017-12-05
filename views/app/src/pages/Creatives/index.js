import React, { Component } from 'react'
import CreativePanel from './CreativePanel'
import DirectoryPanel from './DirectoryPanel'
import DragBar from './DragBar'

import './style.scss'

const PANEL_SIZE_LIMIT = [10, 90]

class Creatives extends Component {
  constructor(props) {
    super(props)
    this.state = {
      leftWidthPerc: 50
    }
  }

  resizePanels = middleX => {
    const perc = middleX * 100 / window.innerWidth
    const limitedPerc = Math.min(
      Math.max(PANEL_SIZE_LIMIT[0], perc),
      PANEL_SIZE_LIMIT[1]
    )
    this.setState({
      leftWidthPerc: limitedPerc
    })
  }

  render() {
    const creativeStyle = {
      width: `${this.state.leftWidthPerc}%`
    }

    return (
      <div className="page creatives">
        <CreativePanel style={creativeStyle} />
        <DragBar parentResizePanels={this.resizePanels} />
        <DirectoryPanel />
      </div>
    )
  }
}

export default Creatives
