import React, { Component } from 'react';
//import { Link } from 'react-router-dom'
import LoginLogout from './LoginLogout';
import './header.css';

class Header extends Component {

  render() {
    return <header className="hero header">
        <div className="hero-head">
          <div className="container">
            <nav className="navbar">
              <div className="container">
                <div className="navbar-left navbar-menu">
                  <a className="navbar-item title is-3" href="/">
                    Flip*Doubt
                  </a>
                </div>
                <div className="navbar-right navbar-menu navbar-end">
                  <a className="navbar-item" href="/">
                    Home
                  </a>
                  <a className="navbar-item" href="/transform">
                    Transform
                  </a>
                  <a className="navbar-item" href="/rate">
                    Rate
                  </a>
                  <span className="navbar-item">
                    <LoginLogout {...this.props} />
                  </span>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>;
  }
}

export default Header;
