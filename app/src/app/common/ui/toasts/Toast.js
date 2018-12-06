import React, { Component } from 'react';
import { connect } from "react-redux";

import { removeNotification } from '../../state/notifications/reducer';
import './Toast.css';

class Toast extends Component {
  componentDidMount() {
    let entry = this.props.entry;
    
    this.timerId = setTimeout(() => {
      this.props.removeNotification(entry.id);
    }, entry.timeout);
  }

  componentWillMount() {
    if (this.timerId) { clearTimeout(this.timerId); }
  }

  render() {
    let entry = this.props.entry;

    return (
      <div className="Toast bg-color-dark-var1 text-color-var1 ink-popup">
        <div className="Toast-content">{entry.message}</div>
        <i className="material-icons md-18 Toast-close ink-link-var1"
          onClick={(e) => this.props.removeNotification(entry.id)}>
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
)(Toast);
