import React, { Component } from 'react';
import SyncPlayer from '../../core/sync-player/SyncPlayer';
import uuidv1 from 'uuid/v1';

import './DemoPlayer.css';

/**
 * Properties:
 *  - syncClient
 *  - roomId
 *  - video
 *  - className
 */
class DemoPlayer extends Component {
  constructor(props) {
    super(props);
    this.playerId = 'dp-' + uuidv1();
  }

  render() {
    let { roomId, video, className } = this.props;

    return (
      <div className="DemoPlayer">
        <SyncPlayer 
          playerId={this.playerId}
          roomId={roomId}
          video={video}
          mutex={false}
          className={className} />
      </div>
    );
  }
}

export default DemoPlayer;
