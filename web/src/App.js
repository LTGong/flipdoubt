import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom'

import {withAuth} from './Auth';

import Footer from './Footer';
import FrontPage from './FrontPage';
import Header from './Header';
import User from './User';
import Community from './Community';

class App extends Component {

  render() {

    return <div className="App">
        <Header {...this.props} />
        <Route path="/user" render={props => <User {...props} {...this.props} />} />
        <br />
        <Route exact path="/" render={props=> <FrontPage {...this.props} />} />
        <br />
        <Route path="/community" render={props=> <Community {...this.props} />} />
        <br />
        <Footer />
      </div>;
  }
}

export default withAuth(App);
