import React from 'react';
import { connect } from "react-redux";
import AbstractBanner from './AbstractBanner';

import { removeNotification } from '../../state/notifications/reducer';
import './Banner.css';

/**
 * presentational component for iPad and desktop
 */
class Banner extends AbstractBanner {
  render() {
    let entry = this.props.entry;

    return (
      <div className="Banner ink-popup font-primary-light bg-color-light">
        <i className="material-icons md-24 Banner-icon">{entry.icon}</i>
        <span className="Banner-text">{entry.message}</span>
        {entry.buttons.map(btn => {
          return React.cloneElement(
            btn, {
              className: 'Banner-button ink-link',
              onClick: this.composeOnClick(btn.props.onClick)
            }
          )
        })}
        <i className="material-icons md-18 Banner-close ink-link-var1"
          onClick={this.onCloseClicked}>
          close
        </i>
      </div>
    );
  }
}

export default connect(
  state => ({}),
  dispatch => ({
    removeNotification(entryId) {
      dispatch(removeNotification(entryId));
    }
  })
)(Banner);
