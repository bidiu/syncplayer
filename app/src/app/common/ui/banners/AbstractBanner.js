import { Component } from 'react';

/**
 * base class for Banner and MobileBanner
 */
class AbstractBanner extends Component {
  /** close button click handler */
  onCloseClicked = function (e) {
    let removeNotification = this.props.removeNotification;
    let entry = this.props.entry;
    let onClose = entry.onClose;

    removeNotification(entry.id);
    if (typeof onClose === 'function') { onClose(); }
  }.bind(this);

  composeOnClick(handler) {
    return (e) => {
      let removeNotification = this.props.removeNotification;
      let entry = this.props.entry;

      removeNotification(entry.id);
      if (typeof handler === 'function') { handler(e); }
    };
  }

  componentDidMount() {
    let timeout = this.props.entry.timeout;

    if (typeof timeout === 'number') {
      this.timerId = setTimeout(() => {
        this.onCloseClicked();
      }, timeout);
    }
  }

  componentWillUnmount() {
    if (this.timerId) { clearTimeout(this.timerId); }
  }
}

export default AbstractBanner;
