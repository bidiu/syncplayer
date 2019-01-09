import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router';
import HistoryEntry from './history-entry/HistoryEntry';

import { clearRooms } from '../common/state/rooms/index';

import './RoomHistory.css';

const EmptyHistory = (props) => (
  <div className="EmptyHistory">
    <div>
      You don't have any watching history here. 
      Why don't you go <a href="/" className="sp-link">create a room</a>?
    </div>
  </div>
);

class RoomHistory extends Component {
  handleClick = (e) => {
    e.preventDefault();
    this.props.clearRooms();
  };

  render() {
    let { rooms, history } = this.props;
    let entries = history.map(roomId => rooms[roomId]);
    let empty = entries.length === 0;

    return (
      <div className="RoomHistory">
        <div className="RoomHistory-clear">
          All watching history is stored only locally on your machine. 
          They will never be uploaded to the server (syncplayer.live). 
          You can also try&nbsp;
          <a href="#fake" className="sp-link-var1"
            onClick={this.handleClick}>
            clearing watching history
          </a>.
        </div>
        {empty && (
          <EmptyHistory />
        )}
        {!empty && entries.map(room => (
          <HistoryEntry key={room.id} room={room} />
        ))}
      </div>
    );
  }
}

export default withRouter(connect(
  state => ({
    rooms: state.rooms.rooms,
    history: state.rooms.history
  }),
  dispatch => ({
    clearRooms() {
      dispatch(clearRooms());
    }
  })
)(RoomHistory));
