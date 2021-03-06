import React, { Component } from 'react';
import DPlayer from 'dplayer';
import GenericPlayer from '../generic-player';
import { capitalize } from '../../utils/commonUtils';

import 'dplayer/dist/DPlayer.min.css';
import './VideoPlayer.css';

const eventNames = [
  'abort', 'canplay', 'canplaythrough',
  'durationchange', 'emptied', 'ended',
  'error', 'loadeddata', 'loadedmetadata',
  'loadstart', 'mozaudioavailable', 'pause',
  'play', 'playing', 'progress',
  'ratechange', 'seeked', 'seeking',
  'stalled', 'suspend', 'timeupdate',
  'volumechange', 'waiting',
];

/**
 * Must pass the `container` prop, which is a class name, 
 * different from DPlayer.
 */
class VideoPlayer extends Component {
  componentDidMount() {
    let { container, ...props } = this.props;
    let events = {}; // event name => handler

    for (let eventName of eventNames) {
      let propName = 'on' + capitalize(eventName);
      let handler = props[propName];
      
      if (handler) {
        events[eventName] = handler;
        delete props[propName];
      }
    }

    this.player = new DPlayer({
      container: document.querySelector(`.${container}`),
      ...props
    });
    // generic player is easier to use, and 
    // more consistent across different video
    // players such as Youtube iframe and Dplayer
    this.genericPlayer = new GenericPlayer(this.player);

    for (let [eventName, handler] of Object.entries(events)) {
      this.player.on(eventName, () => {
        handler(this.genericPlayer);
      })
    }
  }

  componentWillUnmount() {
    this.player.destroy();
  }

  render() {
    let { container } = this.props;

    return (
      <div className={`VideoPlayer ${container}`}>
        VideoPlayer
      </div>
    );
  }
}

export default VideoPlayer;
