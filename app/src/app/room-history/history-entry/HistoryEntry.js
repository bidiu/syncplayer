import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './HistoryEntry.css';

const DefaultVideoPoster = (props) => (
  <div className="DefaultVideoPoster">
    <i className="far fa-play-circle"></i>
  </div>
);

class HistoryEntry extends Component {
  render() {
    let { room } = this.props;
    let createdAt = new Date(room.createdAt.split('T')[0]);

    return (
      <Link to={`/r/${room.id}`} className="HistoryEntry">
        {room.videoPosterUrl && (
          <div className="HistoryEntry-poster cover-bkg"
            style={{ backgroundImage: `url(${room.videoPosterUrl})` }}>
          </div>
        )}
        {!room.videoPosterUrl && (
          <DefaultVideoPoster />
        )}
        <div className="HistoryEntry-content">
          <div className="HistoryEntry-content-title">
            {room.pageTitle}
          </div>
          <div className="HistoryEntry-content-craeted-at">
            Room created at {createdAt.toDateString()}
          </div>
        </div>
      </Link>
    )
  }
}

export default HistoryEntry;
