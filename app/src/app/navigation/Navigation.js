import  React, { Component } from 'react';
import { NavLink } from "react-router-dom";

import './Navigation.css';
import longLogo from '../assets/long_logo.svg';

// <Link to="/">Home</Link>
class Navigation extends Component {
  render() {
    return (
      <div className="Navigation">
        {/* logo */}
        <div className="Navigation-logo">
          <a href="/"><img src={longLogo} alt="logo" /></a>
        </div>

        {/* room history */}
        <div className="Navigation-tab">
          <NavLink 
            className="Navigation-text-link" 
            activeClassName="Navigation-text-link-selected" 
            to="/rooms">
            Rooms
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
    );
  }
}

export default Navigation;
