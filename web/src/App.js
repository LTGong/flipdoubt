import React, {Component} from 'react';
import {Route} from 'react-router-dom'

import {withAuth} from './Auth';

import Footer from './Footer';
import FrontPage from './FrontPage';
import Header from './Header';
import User from './User';
import Community from './Community';
import Rate from './Rate';
import './App.css'
import { library } from '@fortawesome/fontawesome-svg-core'
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight, faCircle } from '@fortawesome/free-solid-svg-icons'
library.add(faAngleLeft, faAngleRight, faCircle)

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
    return <div className="App hero parallax is-primary is-fullheight">
        <Header class="hero-header" {...this.props} />
        <Route path="/user" render={props => <User {...props} {...this.props} />} />
        <Route exact path="/" render={props=> <Community {...this.props} />} />
        <Route path="/transform" render = {props=> <FrontPage showNotification={this.showNotification} {...props} {...this.props} />} />
        <Route path="/rate" render = {props => <Rate {...props} {...this.props} />} />
        <Footer class="hero-footer" />
        <span className={this.state.notification}>Your thought has been transformed!</span>
      </div>;
  }
}

export default withAuth(App);
