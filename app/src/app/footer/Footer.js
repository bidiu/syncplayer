import React, { Component } from 'react';

import youtube from './youtube.png';
import jiqimao from './jiqimao.png';
import './Footer.css';

class Footer extends Component {
  render() {
    return (
      <footer className="Footer">
        <div className="Footer-sections">
          <div className="Footer-section">
            <div className="Footer-title">SyncPlayer</div>
            <div><a href="/about">About</a></div>
            <div><a href="#fake">Privacy Policy</a></div>
          </div>
          <div className="Footer-section">
            <div className="Footer-title">GitHub</div>
            <div><a href="https://github.com/bidiu">Author</a></div>
            <div><a href="https://github.com/bidiu/syncplayer">SyncPlayer</a></div>
          </div>
          <div className="Footer-section">
            <div className="Footer-title">Contact</div>
            <div><a href="mailto:hsun059@gmail.com">Email</a></div>
          </div>
          <div className="Footer-section">
            <div className="Footer-support-title">Support videos from</div>
            <div className="Footer-support-content">
              <img src={youtube} alt="logo" />
              <img src={jiqimao} alt="logo" />
            </div>
          </div>
        </div>
        <div className="Footer-copyright">&copy; syncplayer.live, 2019</div>
      </footer>
    );
  }
}

export default Footer;
