import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom'

import {withAuth} from './Auth';

import Footer from './Footer';
import FrontPage from './FrontPage';
import Header from './Header';
import User from './User';
import Community from './Community';
import './App.css'

class App extends Component {

  render() {
    return <div className="App parallax is-fullheight">
        <Header {...this.props} />
        <Route path="/user" render={props => <User {...props} {...this.props} />} />
        <br />
        <Route exact path="/" render={props=> <Community {...this.props} />} />
        <br />
        <Route path="/transform" render={props=> <FrontPage {...this.props} />} />
        <br />
        <Footer />
      </div>;
  }
}

export default withAuth(App);
