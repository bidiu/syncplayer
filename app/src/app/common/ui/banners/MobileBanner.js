import React from 'react';
import { connect } from "react-redux";
import AbstractBanner from './AbstractBanner';
import InkButton from '../buttons/InkButton';

import { removeNotification } from '../../state/notifications/reducer';
import './MobileBanner.css';

class MobileBanner extends AbstractBanner {
  render() {
    let entry = this.props.entry;

    return (
      <div className="MobileBanner ink-popup font-primary-light bg-color-light">
        {/* first line container */}
        <div className="MobileBanner-top text-color-var1 bg-color-dark">
          <i className="material-icons md-18 MobileBanner-top-icon">{entry.icon}</i>
          <span className="MobileBanner-top-title">{entry.title}</span>
          <i className="material-icons md-18 MobileBanner-top-close ink-link-var1"
            onClick={this.onCloseClicked}>
            close
          </i>
        </div>
        {/* second line container */}
        <div className="MobileBanner-middle">
          {entry.message}
        </div>
        {/* third line container */}
        <div className="MobileBanner-bottom">
          {entry.buttons.map((btn) => (
            <InkButton key={btn.key} onClick={this.composeOnClick(btn.props.onClick)}>
              {btn.props.children}
            </InkButton>
          ))}
        </div>
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
)(MobileBanner);
