import React, { Component } from 'react';

import LoginLogout from './LoginLogout';
import './header.css';

class Header extends Component {

  render() {
    return (
      <header className="hero is-dark header">
      <div className="hero-head">
      <div className="container">
        <nav className="navbar">
          <div className="container">
            <div className="navbar-left navbar-menu">
              <a className="navbar-item title is-3" href="../index.html">
                THERAPIST
              </a>
            </div>
            <div className="navbar-right navbar-menu navbar-end">
              <a className="navbar-item">
                Home
              </a>
              <a className="navbar-item">
                Motivations
              </a>
              <span className="navbar-item">
                <LoginLogout {...this.props} />
              </span>
            </div>
          </div>
        </nav>
      </div>
    </div>
    </header>
    )
  }
  
}

export default Header;
