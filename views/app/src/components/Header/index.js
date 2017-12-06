import React, { PureComponent } from 'react'
import './style.scss'
import logo from './images/icon_32.png'

class Header extends PureComponent {

  render() {
    return (
      <header className='header'>
				<div className="logo-container clear-after">
					<img src={logo} className="left" />
      		<h1 className="left">Creative Server</h1>
				</div>
      </header>
    )
  }
}
 
export default Header