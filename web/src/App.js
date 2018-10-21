import React, {Component} from 'react';
import {Route} from 'react-router-dom'

import {withAuth} from './Auth';

import Footer from './Footer';
import FrontPage from './FrontPage';
import Header from './Header';
import User from './User';
import Community from './Community';
import './App.css'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      notification: "nortification is-hidden"
    }
    this.showNotification = this.showNotification.bind(this);
  }

  showNotification() {
      this.setState({notification: "nortification animateOpen"})
  }

  render() {
    return <div className="App parallax is-fullheight">
        <Header {...this.props} />
        <Route path="/user" render={props => <User {...props} {...this.props} />} />
        <br />
        <Route exact path="/" render={props=> <Community {...this.props} />} />
        <br />
        <Route path="/transform" render={props=> <FrontPage showNotification={this.showNotification} {...props} {...this.props} />} />
        <br />
        <Footer />

        <span className={this.state.notification}>Your thought has been transformed!</span>

      </div>;
  }
}

export default withAuth(App);
