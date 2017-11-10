import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom'

import {withAuth} from './Auth';

// import ApiDemoPage from './ApiDemoPage';
import Footer from './Footer';
import FrontPage from './FrontPage';
import Header from './Header';
import User from './User';

class App extends Component {

  render() {

    return <div className="App">
        <Header {...this.props} />
        <Route path="/user" render={props => <User {...props} {...this.props} />} />
        <br />
        <Route path="/" render={props=> <FrontPage {...this.props} />} />
        <br />
        <Footer />
      </div>;
  }
}

// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <Switch>
//           <Route
//             path="/user"
//             render={props => <User {...props} {...this.props} />}
//           />
//           <div>
//             <Header {...this.props} />
//             <br />
//             <Route exact path="/" component={FrontPage} />
//             <br />
//             <Footer />
//           </div>
//         </Switch>
//       </div>
//     );
//   }
// }
export default withAuth(App);
