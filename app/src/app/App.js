import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router';
import SyncClientContext from './core/sync-client-context';
import ViewportQuery from './common/ui/viewports/ViewportQuery';
import BannerList from './common/ui/banners/BannerList';
import ToastList from './common/ui/toasts/ToastList';
import SyncClient from './core/sync-client';
import SyncPlayer from './core/sync-player/SyncPlayer';
import { getScrollBarWidth } from './utils/domUtils';
import env from './env/environment';

import { setScrollbarWidth } from './common/state/newui/index';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.syncClient = new SyncClient({ syncServerUrl: env.syncServerUrl });
    this.syncClient.connect();
    setTimeout(() => {
      this.syncClient.joinRoom('5c095a357b5aed0028f39e5c');
    }, 3000)
  }

  componentDidMount() {
    // set scrollbar width
    this.props.setScrollbarWidth(getScrollBarWidth());
  }

  render() {
    let viewportType = this.props.viewportType;
    let video = {
      url: 'http://iqiyi.qq-zuidazy.com/20181122/1275_69060aab/800k/hls/index.m3u8',
      type: 'hls'
    };

    return (
      <SyncClientContext.Provider value={this.syncClient}>
        <div className={`App ${viewportType}`}>
          <ViewportQuery />
          <BannerList />
          <ToastList />
          <SyncPlayer playerId='test-player' video={video} className="test-sync-player" />
        </div>
      </SyncClientContext.Provider>
    );
  }
}

export default withRouter(connect(
  state => ({
    viewportType: state.ui.viewportType,
  }),
  dispatch => ({
    setScrollbarWidth(width) {
      dispatch(setScrollbarWidth(width));
    }
  })
)(App));
