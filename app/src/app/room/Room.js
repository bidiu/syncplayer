import React, { Component } from 'react';
import { connect } from "react-redux";
import SyncClientContext from '../core/sync-client-context';
import SyncPlayer from '../core/sync-player/SyncPlayer';
import resources from '../common/rest/resources';
import { getPayload } from '../utils/epicUtils';
import uuidv1 from 'uuid/v1';

import { unshiftRoom } from '../common/state/rooms/index';

import './Room.css';

/**
 * TODO For now, during the lifetime of this component, the 
 * `roomId` to display will never change. Later it might need 
 * to support changing the `roomId` and video info on-the-fly 
 * by using `getDerivedStateFromProps`.
 * 
 * For supporting that, SyncPlayer is also need to be changed.
 */
class Room extends Component {
  constructor(props) {
    super(props);
    this.playerId = 'dp-' + uuidv1();
    this.state = {
      room: null, 
      notFound: false
    };
  }

  componentDidMount() {
    let { roomId } = this.props.match.params;
    let { rooms } = this.props;
    let room = rooms[roomId];

    if (room) {
      this.setState({ room });
      return;
    }

    (async () => {
      try {
        let response = await fetch(resources.retrieveRoom(roomId));
        let { data: room } = await getPayload(response);
        this.props.unshiftRoom(room);
        this.setState({ room });
        
      } catch (err) {
        if (err.status === 404) {
          this.setState({ notFound: true });
          return;
        }
        alert(err.message);
      }
    })();
  }

  componentWillUnmount() {
    let { room } = this.state;
    if (room) {
      this.props.syncClient.leaveRoom(room.id);
    }
  }

  handlePlayerReady = () => {
    let { roomId } = this.props.match.params;
    let { syncClient } = this.props;
    let { notFound } = this.state;

    if (!notFound) {
      syncClient.joinRoom(roomId);
    }
  };

  render() {
    let { room, notFound } = this.state;
    let { viewportType } = this.props;

    if (notFound) {
      return (
        <div className="Room">
          404
        </div>
      );
    }

    if (!room) {
      return (
        <div className="Room">
          Loading...
        </div>
      );
    }

    return (
      <div className="Room">
        {/* main */}
        <div className="Room-flex-main">
          <SyncPlayer 
            roomId={room.id}
            playerId={this.playerId}
            className="Room-sync-player"
            video={{ url: room.videoUrl, type: room.videoType }}
            onPlayerReady={this.handlePlayerReady} />
          <div className="text-truncate Room-sync-player-title">
            {room.pageUrl ? (
              <a href={room.pageUrl}>{room.pageTitle || "No Title"}</a>
            ) : (
              <div>{room.pageTitle || "No Title"}</div>
            )}
          </div>
        </div>

        {/* sidebar */}
        {viewportType === 'VIEWPORT_DESKTOP' && (
          <div className="Room-flex-side">
            Feature not implemented
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  state => ({
    viewportType: state.ui.viewportType,
    rooms: state.rooms.rooms
  }),
  dispatch => ({
    unshiftRoom(room) {
      dispatch(unshiftRoom(room));
    }
  })
)((props) => (
  <SyncClientContext.Consumer>
    {syncClient => (
      <Room syncClient={syncClient} {...props} />
    )}
  </SyncClientContext.Consumer>
));
