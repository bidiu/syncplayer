import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter, Redirect } from 'react-router';
import PageUrlInput from './page-url-input/PageUrlInput';
import Demo from './demo/Demo';
import resources from '../common/rest/resources';
import { getPayload } from '../utils/epicUtils';

import { unshiftRoom } from '../common/state/rooms/index';

import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoUrl: '',
      videoType: '',
      pageUrl: '',
      requesting: false,
      roomToRedirect: null
    };
  }

  handlePageUrlChange = (e) => {
    if (!this.state.requesting) {
      this.setState({ pageUrl: e.target.value });
    }
  };

  handlePageUrlSubmit = (e) => {
    e.preventDefault();
    let { pageUrl, requesting } = this.state;
    if (requesting || !pageUrl.trim()) { return; }

    this.setState({ requesting: true }, async () => {
      // set state callback
      try {
        let response = await fetch(resources.createRoom({ pageUrl }));
        let { data: room } = await getPayload(response);
        this.props.unshiftRoom(room);
        this.setState({ roomToRedirect: room.id });
  
      } catch (err) {
        alert(err.message);
  
      } finally {
        this.setState({ requesting: false });
      }
    });
  };

  render() {
    let { pageUrl, requesting, roomToRedirect } = this.state;

    return (
      <div className="Home">
        {roomToRedirect && <Redirect to={`/r/${roomToRedirect}`} />}
        <PageUrlInput 
          value={pageUrl} 
          requesting={requesting}
          onChange={this.handlePageUrlChange}
          onSubmit={this.handlePageUrlSubmit} />
        <Demo />
      </div>
    );
  }
}

export default withRouter(connect(
  state => ({}),
  dispatch => ({
    unshiftRoom(room) {
      dispatch(unshiftRoom(room));
    }
  })
)(Home));
