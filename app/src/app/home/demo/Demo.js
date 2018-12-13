import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router';
import { Observable } from 'rxjs/Observable';
import SyncClientContext from '../../core/sync-client-context';
import SyncClient from '../../core/sync-client';
import DemoPlayer from '../demo-player/DemoPlayer';
import { getTransitionNum } from '../../utils/animationUtils';
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

  componentDidMount() {
    Observable.fromEvent(window, 'scroll', { passive: true })
      .subscribe(() => {
        requestAnimationFrame(() => {

          let vh = this.props.viewportSize.height;
          if (!vh) { return; }
          let low = Math.round(vh * 0.5);
          let high = Math.round(vh * 0.8);
          let cur = window.scrollY;

          // player's outer div, instead of the player itself
          let syncPlayers = Array.from(document.querySelectorAll('.DemoPlayer-sync-player'));
          if (!syncPlayers.length) { return; }

          if (cur < low) {
            syncPlayers[0].style.transform = '';
            syncPlayers[1].style.transform = '';
          } else if (cur > high) {
            syncPlayers[0].style.transform = 'translateX(0)';
            syncPlayers[1].style.transform = 'translateX(0)';
          } else {
            let percentage = (cur - low) / (high - low);
            syncPlayers[0].style.transform = `translateX(${Math.round(getTransitionNum(-75, 0, percentage))}%)`;
            syncPlayers[1].style.transform = `translateX(${Math.round(getTransitionNum(75, 0, percentage))}%)`;
          }
        });
      });
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
                video={{ url, type }}
                className="DemoPlayer-sync-player DemoPlayer-sync-player-1" />
            </SyncClientContext.Provider>
          </div>
          <div className="Demo-player-container">
            <SyncClientContext.Provider value={this.syncClients[1]}>
              <DemoPlayer 
                roomId={roomId}
                syncClient={this.syncClients[1]}
                video={{ url, type }}
                className="DemoPlayer-sync-player DemoPlayer-sync-player-2" />
            </SyncClientContext.Provider>
          </div>
        </div>
        <div className="Demo-text-container">
          <h1 className="Demo-text-title" data-aos="zoom-out-down">
            Playback Synchronization over the Internet
          </h1>
          <div className="Demo-text-desc">
            Play around with the demo above to see how it works
            (it doesn't work on mobile devices that only support
            playing at most one video simultaneously)
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(
  state => ({
    roomId: state.rooms.demo,
    rooms: state.rooms.rooms,
    viewportSize: state.newui.viewport
  }),
  dispatch => ({})
)(Demo));
