import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter, Route } from 'react-router';
import SyncClientContext from './core/sync-client-context';
import ViewportQuery from './common/ui/viewports/ViewportQuery';
import BannerList from './common/ui/banners/BannerList';
import ToastList from './common/ui/toasts/ToastList';
import SyncClient from './core/sync-client';
import Navigation from './navigation/Navigation';
import Home from './home/Home';
import RoomHistory from './room-history/RoomHistory';
import About from './about/About';
import Room from './room/Room';
import { getScrollBarWidth } from './utils/domUtils';
import { getPayload } from './utils/epicUtils';
import resources from './common/rest/resources';
import env from './env/environment';

import { addDemoRoom } from './common/state/rooms/index';
import { setScrollbarWidth } from './common/state/newui/index';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.syncClient = new SyncClient({ syncServerUrl: env.syncServerUrl });
    this.syncClient.connect();
  }

  componentDidMount() {
    this.createDemoRoom();
    // set scrollbar width
    this.props.setScrollbarWidth(getScrollBarWidth());
  }

  async createDemoRoom() {
    try {
      let response = await fetch(resources.createRoom(env.demoVideoInfo));
      let { data: room } = await getPayload(response);
      this.props.addDemoRoom(room);

    } catch (err) {
      alert(err.message);
    }
  }

  render() {
    let viewportType = this.props.viewportType;

    return (
      <SyncClientContext.Provider value={this.syncClient}>
        <div className={`App ${viewportType}`}>
          <ViewportQuery />
          <BannerList />
          <ToastList />
          <Navigation />

          <Route exact path="/" component={Home} />
          <Route exact path="/rooms" component={RoomHistory} />
          <Route exact path="/about" component={About} />
          <Route exact path="/r/:roomId" component={Room} />
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
    },
    addDemoRoom(room) {
      dispatch(addDemoRoom(room));
    }
  })
)(App));
