import React, { Component } from 'react';
import { connect } from "react-redux";

import { setUiViewport } from '../../state/ui/reducer';
import './Viewport.css';

class Viewport extends Component {
  componentDidMount() {
    let nextViewportType = this.props.nextViewportType;
    this.props.setUiViewport(nextViewportType);
  }

  render() {
    return (<div title={this.props.viewportType}></div>);
  }
}

export default connect(
  state => ({
    viewportType: state.ui.viewportType
  }),
  dispatch => ({
    setUiViewport(viewportType) {
      dispatch(setUiViewport(viewportType));
    }
  })
)(Viewport);
