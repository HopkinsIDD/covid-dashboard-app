import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class NavBar extends Component {
    render() {
        return (
          <div className="App-header">
            <h1 className="titleNarrow siteTitle">COVID-19 Scenario Modeling</h1>
            <div className="row">
              <div className="col-8">
                <h4>Prepared by&nbsp;
                  <a
                    className="customLink"
                    href="http://www.iddynamics.jhsph.edu/">
                    Johns Hopkins IDD</a>
                  &nbsp;Working Group 
                </h4>
              </div>
              <div className="col-4">
                <ul>
                  <li>
                    <NavLink exact={true} activeClassName='active' to="/">
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink activeClassName='active' to="/scenarios">
                      Scenarios
                    </NavLink>
                  </li>
                  <li>
                    <NavLink activeClassName='active' to="/methods">
                      Methods
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )
    }
}

export default NavBar;