import React from 'react';
//import { Link } from 'react-router-dom'

// lightweight component declaration style
const Footer = () => (
      <footer className="footer">
        <div className="container">
          <div className="content has-text-centered">
            <p>
              <strong>Therapist</strong> by Frozen City Savages.
            </p>
            <p>
              <a className="icon" href="https://github.com/umn-5117-f17/module-3-group-assignment-frozen-city-savages">
                <i className="fa fa-github"></i>
              </a>
            </p>
          </div>
        </div>
      </footer>
);

export default Footer;


// <h1>pages:</h1>
// <ul>
//   <li><Link to="/">home page</Link></li>
//   <li><Link to="/profile">profile page (protected)</Link></li>
//   <li><Link to="/api-demo">API demo (protected and unprotected)</Link></li>
// </ul>
