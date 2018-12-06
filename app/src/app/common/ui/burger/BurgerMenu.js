import React, { Component } from 'react';

import './BurgerMenu.css';

class BurgerMenu extends Component {
  constructor(props) {
    super(props);
    this.handleMenuIconClick = this.handleMenuIconClick.bind(this);
    this.handleCloseIconClick = this.handleCloseIconClick.bind(this);
  }

  handleMenuIconClick(event) {
    this.props.onMenuIconClick(event);
  }

  handleCloseIconClick(event) {
    this.props.onCloseIconClick(event);
  }

  render() {
    let { open } = this.props;

    return (
      <div className="BurgerMenu">
        <i className="material-icons burger-icon"
          onClick={this.handleMenuIconClick}>
          menu
        </i>
        <div className={`sidebar ${open ? 'open' : ''}`}>
          <i className="material-icons close-icon"
            onClick={this.handleCloseIconClick}>
            close
          </i>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default BurgerMenu;
