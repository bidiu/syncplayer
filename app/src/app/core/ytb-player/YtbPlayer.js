import React, { Component } from 'react';
import GenericPlayer from '../generic-player';

import './YtbPlayer.css';

const timeUpdatesInterval = 1000 / 4;

/**
 * Thin layer above Youtube iframe player, sutable for the synchronous
 * scenerio here, which means that this has the same interface as the
 * `VideoPlayer` component based on Dplayer.
 * 
 * Properties:
 *  - container
 * 
 *  - onPlay
 *  - onPause
 *  - onSeeking
 *  - onTimeupdate
 *  - onPlayerReady
 * 
 * TODO investigate `crossorigin` on script tag
 */
class YtbPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      youtubeEmbeddedApiReady: window.youtubeEmbeddedApiReady
    };

    // `_currentTime` (NOTE in millisecond unit) and `_timestamp`
    // are used to track where `seeking` event happens, same with 
    // `_frameReqId` and `_seekingAt`
    this._currentTime = 0;
    this._timestamp = window.performance.now();
    this._frameReqId = null;
    // last seeking timestamp (if any, otherwise null)
    this._seekingAt = null;

    // for `onTimeupdate` (throttling the frame)
    this._currentTimeInSec = 0;
    this._timeUpdateAt = null;
  }

  componentDidMount() {
    if (typeof window.onYouTubeIframeAPIReady !== 'function') {
      window.onYouTubeIframeAPIReady = () => {
        window.youtubeEmbeddedApiReady = true;
        this.setState({ youtubeEmbeddedApiReady: true });
      };
    }

    if (!window.youtubeEmbeddedApiLoaded) {
      // load the IFrame Player API code asynchronously.
      window.youtubeEmbeddedApiLoaded = true;
      let tag = document.createElement('script');
      // TODO tag.setAttribute('crossorigin', '');
      tag.src = "https://www.youtube.com/iframe_api";
      let firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    if (this.state.youtubeEmbeddedApiReady) {
      this.createYoutubeIframePlayer();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let { youtubeEmbeddedApiReady } = this.state;
    if (!prevState.youtubeEmbeddedApiReady && youtubeEmbeddedApiReady) {
      this.createYoutubeIframePlayer();
    }
  }

  componentWillUnmount() {
    if (this.player) { this.player.destroy(); }
    if (this._frameReqId) { cancelAnimationFrame(this._frameReqId); }
  }

  /**
   * Passed to `requestAnimationFrame` to track
   * whether `seeking` event happens.
   */
  trackCurrentTime = (now) => {
    let { onSeeking, onTimeupdate } = this.props;
    let currentTimeInSec = this.player.getCurrentTime ?
      this.player.getCurrentTime() : 0;
    let currentTime = currentTimeInSec * 1000;
    let deltaCurrentTime = currentTime - this._currentTime;
    let deltaTimestamp = now - this._timestamp;

    if (Math.abs(deltaCurrentTime) > deltaTimestamp * 60) {
      this._seekingAt = now;
      onSeeking && onSeeking(this.genericPlayer);
    }

    let elapsed = now - this._timeUpdateAt;
    if (!this._timeUpdateAt || elapsed > timeUpdatesInterval) {
      this._timeUpdateAt = now - (elapsed % timeUpdatesInterval);
      
      if (this._currentTimeInSec !== currentTimeInSec) {
        this._currentTimeInSec = currentTimeInSec;
        onTimeupdate && onTimeupdate(this.genericPlayer);
      }
    }

    // update internal states
    this._currentTime = currentTime;
    this._timestamp = now;

    // TODO should wait until iframe player is ready & fix might affect detecting seeking
    // request next frame
    this._frameReqId = requestAnimationFrame(this.trackCurrentTime);
  };

  createYoutubeIframePlayer() {
    let { container, video, onPlayerReady } = this.props;

    this.YT = window.YT;
    this.player = new this.YT.Player(container, {
      height: '390',
      width: '640',
      videoId: video.url,
      events: {
        'onStateChange': this.handlePlayerStateChange,
        'onReady': () => {
          onPlayerReady && onPlayerReady(this.genericPlayer);
          // track current time
          requestAnimationFrame(this.trackCurrentTime);
        }
      }
    });
    // generic player is easier to use
    this.genericPlayer = new GenericPlayer(this.player, 'youtube');
  }

  handlePlayerStateChange = (e) => {
    let { onPlay, onPause } = this.props;
    let now = window.performance.now();
    let YT = this.YT;

    switch (e.data) {
      case YT.PlayerState.PLAYING:
        // 1000 here is based on experiments, so of course it
        // might not be optimal for other environments (i.e. 
        // network, machine performance, etc.)
        if (!this._seekingAt || now - this._seekingAt > 1000) {
          onPlay && onPlay(this.genericPlayer);
        }
        break;
      
      case YT.PlayerState.PAUSED:
        // in case `seeking`, `paused` will be triggered first,
        // use setTimeout to see whether it's really a `paused`,
        // again, all times here are based on experiments
        setTimeout(() => {
          let now = window.performance.now();
          if (!this._seekingAt || now - this._seekingAt > 800) {
            onPause && onPause(this.genericPlayer);
          }
        }, 50);
        break;

      default:
        // nothing
    }
  };

  render() {
    let { container } = this.props;

    return (
      <div className="YtbPlayer">
        <div id={container}></div>
      </div>
    );
  }
}

export default YtbPlayer;
