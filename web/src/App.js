import React, {Component} from 'react';
import {Route} from 'react-router-dom'

import {withAuth} from './Auth';
import ApiDemoPage from './ApiDemoPage';
import Footer from './Footer';
import FrontPage from './FrontPage';
import Header from './Header';
import ProfilePage from './ProfilePage';

class App extends Component {

  render() {

    return (
      <div className="App">

        <Header {...this.props}/>
        <br />
        <Route exact path="/" component={FrontPage}/>
        <br />
        <Footer/>

      </div>
    );
  }
}

export default withAuth(App);
