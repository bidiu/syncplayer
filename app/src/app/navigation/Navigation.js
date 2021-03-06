import  React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router';
import { NavLink } from "react-router-dom";

import './Navigation.css';
import longLogo from '../assets/long_logo.svg';
import shortLogo from '../assets/short_logo.svg';

class Navigation extends Component {
  render() {
    let logoUrl = this.props.viewportType === 'VIEWPORT_MOBILE' ?
      shortLogo : longLogo;

    return (
      <div className="Navigation">
        <div className="Navigation-flex-container">
          {/* logo */}
          <div className="Navigation-logo">
            <a href="/"><img src={logoUrl} alt="logo" /></a>
          </div>

          {/* room history */}
          <div className="Navigation-tab">
            <NavLink 
              className="Navigation-text-link" 
              activeClassName="Navigation-text-link-selected" 
              to="/rooms">
              History
            </NavLink>
          </div>

          {/* about */}
          <div className="Navigation-tab">
            <NavLink
              className="Navigation-text-link" 
              activeClassName="Navigation-text-link-selected" 
              to="/about">
              About
            </NavLink>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(
  state => ({
    viewportType: state.ui.viewportType
  }),
  dispatch => ({})
)(Navigation));
