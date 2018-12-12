import React, { Component } from 'react';
import SyncClientContext from '../sync-client-context';
import VideoPlayer from '../../common/ui/video-player/VideoPlayer';

import './SyncPlayer.css';

/**
 * You must pass the prop `playerId`, which is a string to 
 * identify the player from other SyncPlayers in the same
 * application instance.
 * 
 * You can pass a `className` prop to style the player container,
 * i.e., its width.
 * 
 * Properties:
 *  - roomId
 *  - playerId
 *  - className
 *  - any props that underlying player supports
 */
class SyncPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = { connected: this.props.syncClient.isConnected() };
    this.videoPlayerRef = React.createRef();
    // `seeking` or `time_update` (when progress adjustment is necessary)
    this.receivedSeekingFromServer = false;
  }

  componentDidMount() {
    let { syncClient } = this.props;

    syncClient.on('connect', this.handleConnect);
    syncClient.on('disconnect', this.handleDisconnect);
    syncClient.on('play', this.handlePlayFromServer);
    syncClient.on('pause', this.handlePauseFromServer);
    syncClient.on('seeking', this.handleSeekingFromServer);
    syncClient.on('time_update', this.handleTimeUpdateFromServer);
  }

  componentWillUnmount() {
    let { syncClient } = this.props;

    syncClient.off('connect', this.handleConnect);
    syncClient.off('disconnect', this.handleDisconnect);
    syncClient.off('play', this.handlePlayFromServer);
    syncClient.off('pause', this.handlePauseFromServer);
    syncClient.off('seeking', this.handleSeekingFromServer);
    syncClient.off('time_update', this.handleTimeUpdateFromServer);
  }

  handleConnect = () => {
    this.setState({ connected: true });
  };

  handleDisconnect = () => {
    this.setState({ connected: false })
  };

  handlePlayFromServer = (roomId) => {
    if (this.props.roomId !== roomId) { return; }
    let player = this.videoPlayerRef.current.player;
    
    if (player.video.paused) {
      player.play();
    }
  };

  handlePauseFromServer = (roomId) => {
    if (this.props.roomId !== roomId) { return; }
    let player = this.videoPlayerRef.current.player;

    if (!player.video.paused) {
      this.videoPlayerRef.current.player.pause();
    }
  };

  handleSeekingFromServer = (roomId, currentTime, timestamp) => {
    if (this.props.roomId !== roomId) { return; }
    this.receivedSeekingFromServer = true;
    this.videoPlayerRef.current.player.seek(currentTime);
  };

  handleTimeUpdateFromServer = (roomId, paused, currentTime, timestamp) => {
    if (this.props.roomId !== roomId) { return; }
    let player = this.videoPlayerRef.current.player;

    if (player.video.paused !== paused) {
      player.toggle();
    }
    if (Math.abs(player.video.currentTime - currentTime) > 1) {
      this.receivedSeekingFromServer = true;
      this.videoPlayerRef.current.player.seek(currentTime);
    }
  };

  handlePlay = (player) => {
    this.props.syncClient.play(this.props.roomId, player.video.currentTime);
  };

  handlePause = (player) => {
    this.props.syncClient.pause(this.props.roomId, player.video.currentTime);
  };

  handleSeeking = (player) => {
    if (this.receivedSeekingFromServer) {
      this.receivedSeekingFromServer = false;
      return;
    }

    let { currentTime, paused } = player.video;
    this.props.syncClient.seek(this.props.roomId, paused, currentTime);
  }

  /**
   * TODO debounce
   */
  handleTimeUpdate = (player) => {
    let { currentTime, paused } = player.video;
    this.props.syncClient.updateTime(this.props.roomId, paused, currentTime);
  };

  render() {
    let { playerId, className = '', ...props } = this.props;

    return (
      <div className={`SyncPlayer ${className}`}>
        <VideoPlayer 
          container={playerId} 
          onPlay={this.handlePlay}
          onPause={this.handlePause} 
          onSeeking={this.handleSeeking}
          onTimeupdate={this.handleTimeUpdate}
          ref={this.videoPlayerRef}
          {...props} />
      </div>
    );
  }
}

export default (props) => (
  <SyncClientContext.Consumer>
    {syncClient => (
      <SyncPlayer syncClient={syncClient} {...props} />
    )}
  </SyncClientContext.Consumer>
);
