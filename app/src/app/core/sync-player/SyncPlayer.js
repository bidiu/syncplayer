import React, { Component } from 'react';
import SyncClientContext from '../sync-client-context';
import VideoPlayer from '../video-player/VideoPlayer';
import YtbPlayer from '../ytb-player/YtbPlayer';

import './SyncPlayer.css';

/**
 * You must pass the prop `playerId`, which is a string to 
 * identify the player from other SyncPlayers in the same
 * application instance.
 * 
 * The player won't take care of joining the room specified
 * by the given `roomId`, so you should join the room outside
 * this component. And the timing could be tricky here.
 * 
 * You can pass the `roomId` first to render this component, 
 * and then try to join the room. Before joining the room,
 * player will still send action data to sync server with the
 * provided `roomId`. However, sync server won't do anything 
 * becasuse you are not in the room yet. So, even though you 
 * can join the room after, you'd still better to join the 
 * room before, or at least immediately after, you render this 
 * component.
 * 
 * Another tricky timing issue is about `SyncClient`. You don't 
 * need to pass it explicitly; it's captured using React Context.
 * At the point this component is rendered, `SyncClient` might
 * not have connected to sync server yet. It won't cause any
 * severe problem here, but no action data whatsoever will be
 * sent to sync server. As soon as `SyncClient` is connected,
 * the problem in question will be fixed automatically. Still,
 * it's better to connect and join room first before rendering
 * this component.
 * 
 * For more about these timing issues, read `SyncClient` doc.
 * 
 * You can pass a `className` prop to style the player container,
 * i.e., its width.
 * 
 * Properties:
 *  - roomId
 *  - playerId
 *  - className
 *  - video.url, video.type
 *  - other props that DPlayer supports (not recommended to use)
 * 
 * Events:
 *  - onPlayerReady -- you should join room AFTER player is ready
 * 
 * Note that during the lifetime of this components, props and events
 * provided must NOT change. In the future, support for this might
 * be added.
 */
class SyncPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = { connected: this.props.syncClient.isConnected() };
    this.videoPlayerRef = React.createRef();
    this.playerReady = false;
    // `seeking` or `time_update` (when progress adjustment is necessary)
    this.receivedSeekingFromServer = false;
  }

  componentDidMount() {
    let { syncClient, video, onPlayerReady } = this.props;

    syncClient.on('connect', this.handleConnect);
    syncClient.on('disconnect', this.handleDisconnect);
    syncClient.on('play', this.handlePlayFromServer);
    syncClient.on('pause', this.handlePauseFromServer);
    syncClient.on('seeking', this.handleSeekingFromServer);
    syncClient.on('time_update', this.handleTimeUpdateFromServer);

    // hardcoded for now
    if (video.type !== 'youtube') {
      this.playerReady = true;
      onPlayerReady && onPlayerReady();

      // TODO
      console.log('player ready');
    }
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
    let player = this.videoPlayerRef.current.genericPlayer;
    
    if (player.video.paused) {
      player.play();
    }
  };

  handlePauseFromServer = (roomId) => {
    if (this.props.roomId !== roomId) { return; }
    let player = this.videoPlayerRef.current.genericPlayer;

    if (!player.video.paused) {
      this.videoPlayerRef.current.genericPlayer.pause();
    }
  };

  handleSeekingFromServer = (roomId, currentTime, timestamp) => {
    if (this.props.roomId !== roomId) { return; }
    this.receivedSeekingFromServer = true;
    this.videoPlayerRef.current.genericPlayer.seek(currentTime);
  };

  handleTimeUpdateFromServer = (roomId, paused, currentTime, timestamp) => {
    if (this.props.roomId !== roomId) { return; }
    let player = this.videoPlayerRef.current.genericPlayer;

    if (player.video.paused !== paused) {
      player.toggle();
    }
    if (Math.abs(player.video.currentTime - currentTime) > 1) {
      this.receivedSeekingFromServer = true;
      this.videoPlayerRef.current.genericPlayer.seek(currentTime);
    }
  };

  handlePlay = (player) => {
    this.props.syncClient.play(this.props.roomId, player.video.currentTime);

    // TODO
    console.log('play');
  };

  handlePause = (player) => {
    this.props.syncClient.pause(this.props.roomId, player.video.currentTime);

    // TODO
    console.log('pause');
  };

  handleSeeking = (player) => {
    if (this.receivedSeekingFromServer) {
      this.receivedSeekingFromServer = false;
      return;
    }

    let { currentTime, paused } = player.video;
    this.props.syncClient.seek(this.props.roomId, paused, currentTime);

    // TODO
    console.log('seeking: ' + player.video.currentTime);
  }

  /**
   * TODO debounce
   */
  handleTimeUpdate = (player) => {
    let { currentTime, paused } = player.video;
    this.props.syncClient.updateTime(this.props.roomId, paused, currentTime);

    // TODO
    console.log('time update: ' + player.video.currentTime);
  };

  handlePlayerReady = () => {
    let { onPlayerReady } = this.props;

    this.playerReady = true;
    onPlayerReady && onPlayerReady();

    // TODO
    console.log('player ready');
  };

  render() {
    let { playerId, className = '', video, onPlayerReady, ...props } = this.props;
    let videoPlayer = null;

    if (video.type === 'youtube') {
      videoPlayer = (
        <YtbPlayer 
          container={playerId} 
          video={video}
          onPlay={this.handlePlay}
          onPause={this.handlePause} 
          onSeeking={this.handleSeeking}
          onTimeupdate={this.handleTimeUpdate}
          onPlayerReady={this.handlePlayerReady}
          ref={this.videoPlayerRef}
          {...props} />
      )

    } else {
      videoPlayer = (
        <VideoPlayer 
          container={playerId} 
          video={video}
          onPlay={this.handlePlay}
          onPause={this.handlePause} 
          onSeeking={this.handleSeeking}
          onTimeupdate={this.handleTimeUpdate}
          ref={this.videoPlayerRef}
          {...props} />
      );
    }

    return (
      <div className={`SyncPlayer ${className}`}>
        {videoPlayer}
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
