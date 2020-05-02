import React, { Component } from 'react';

class NavBar extends Component {
    render() {
        return (
            <div>
                <h1 className="titleNarrow siteTitle">COVID-19 Scenario Modeling</h1>
                <h4>Prepared by&nbsp;
                    <a className="customLink" href="http://www.iddynamics.jhsph.edu/">Johns Hopkins IDD</a>
                    &nbsp;Working Group 
                </h4>
            </div>
        )
    }
}

export default NavBar;