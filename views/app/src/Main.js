import React, { Component } from 'react'
import {
  Route,
  NavLink,
  HashRouter
} from 'react-router-dom'

import Header from 'components/Header/index'
import Creatives from 'pages/Creatives'

import 'reset-css/reset.css'
import './styles/main.scss'


class Main extends Component {
  render() {
    return (
        <div>
          <Header />
          <div className="content">
            <Creatives />
          </div>
        </div>
    )
/*    return (
      <HashRouter>
        <div>
          <Header />
          <div className="content">
            <Route exact path="/" component={Creatives}/>
          </div>
        </div>
      </HashRouter>
    )
    */
  }
}
 
export default Main