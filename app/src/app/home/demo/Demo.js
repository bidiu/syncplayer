import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router';
import SyncClientContext from '../../core/sync-client-context';
import SyncClient from '../../core/sync-client';
import DemoPlayer from '../demo-player/DemoPlayer';
import env from '../../env/environment';

import './Demo.css';

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = { roomId: null };
    this.syncClients = [
      new SyncClient({ syncServerUrl: env.syncServerUrl }),
      new SyncClient({ syncServerUrl: env.syncServerUrl })
    ]
    this.syncClients[0].connect();
    this.syncClients[1].connect();
  }

  /**
   * @param {*} props next props
   * @param {*} state prev state
   */
  static getDerivedStateFromProps(props, state) {
    if (props.roomId && props.roomId !== state.roomId) {
      return { roomId: props.roomId };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    let { roomId } = this.state;
    if (roomId !== prevState.roomId) {
      if (prevState.roomId) {
        this.syncClients[0].leaveRoom(prevState.roomId);
        this.syncClients[1].leaveRoom(prevState.roomId);
      }
      if (roomId) {
        setTimeout(() => {
          this.syncClients[0].joinRoom(roomId);
          this.syncClients[1].joinRoom(roomId);
        }, 1000)
      }
    }
  }

  componentWillUnmount() {
    this.syncClients[0].close();
    this.syncClients[1].close();
  }

  render() {
    let { roomId, rooms } = this.props;
    // TODO must NOT render DemoPlayer component
    if (!roomId) { return null; }
    let { videoUrl: url, videoType: type } = rooms[roomId];

    return (
      <div className="Demo">
        <div className="Demo-flex-container">
          <div className="Demo-player-container">
            <SyncClientContext.Provider value={this.syncClients[0]}>
              <DemoPlayer 
                roomId={roomId}
                syncClient={this.syncClients[0]}
                video={{ url, type }} />
            </SyncClientContext.Provider>
          </div>
          <div className="Demo-player-container">
            <SyncClientContext.Provider value={this.syncClients[1]}>
              <DemoPlayer 
                roomId={roomId}
                syncClient={this.syncClients[1]}
                video={{ url, type }} />
            </SyncClientContext.Provider>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(
  state => ({
    roomId: state.rooms.demo,
    rooms: state.rooms.rooms
  }),
  dispatch => ({})
)(Demo));
