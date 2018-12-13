import React, { Component } from 'react';
import YtbPlayer from '../core/ytb-player/YtbPlayer';

import './About.css';

class About extends Component {
  render() {
    return (
      <div className="About">
        <YtbPlayer />
      </div>
    );
  }
}

export default About;
