import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter, Route } from 'react-router';
import { Observable } from 'rxjs/Observable';
import SyncClientContext from './core/sync-client-context';
import ViewportQuery from './common/ui/viewports/ViewportQuery';
import BannerList from './common/ui/banners/BannerList';
import ToastList from './common/ui/toasts/ToastList';
import SyncClient from './core/sync-client';
import ScrollToTop from './common/ui/scroll-to-top/ScrollToTop';
import Navigation from './navigation/Navigation';
import Home from './home/Home';
import RoomHistory from './room-history/RoomHistory';
import About from './about/About';
import Footer from './footer/Footer';
import Room from './room/Room';
import { getScrollBarWidth, getViewportDimension } from './utils/domUtils';
import { getPayload } from './utils/epicUtils';
import { getTransitionColor } from './utils/colorUtils';
import resources from './common/rest/resources';
import env from './env/environment';

import { addDemoRoom, syncRooms } from './common/state/rooms/index';
import { setScrollbarWidth, setViewportSize } from './common/state/newui/index';

import './App.css';

const bodyBgDarkColor = '#FF5445';

const getInitRooms = () => {
  return JSON.stringify({
    rooms: {},
    history: []
  });
};

/**
 * TODO right now, every refresh will create a room for demo, which is not optimal
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.syncClient = new SyncClient({ syncServerUrl: env.syncServerUrl });
    this.syncClient.connect();
  }

  componentDidMount() {
    let { rooms, history } = JSON.parse( window.localStorage.getItem('rooms') || getInitRooms() );
    this.props.syncRooms(rooms, history);

    // create a room for demo
    this.createDemoRoom();

    // set scrollbar width
    this.props.setScrollbarWidth(getScrollBarWidth());

    // update viewport size
    let { width, height } = getViewportDimension();
    this.props.setViewportSize(width, height);

    this.subscriptions = [
      Observable.fromEvent(window, 'resize', { passive: true })
        .debounceTime(1000)
        .subscribe(() => {
          let { width, height } = getViewportDimension();
          this.props.setViewportSize(width, height);
        }),
      
      Observable.fromEvent(window, 'scroll', { passive: true })
        .subscribe(() => {
          requestAnimationFrame(() => {
  
            if (this.props.location.pathname !== '/') { return; }
  
            let vh = this.props.viewportSize.height;
            if (!vh) { return; }
            let low = Math.round(vh * 0.5);
            let high = Math.round(vh * 0.8);
            let cur = window.scrollY;
  
            if (cur < low) {
              document.body.style.backgroundColor = '';
            } else if (cur > high) {
              document.body.style.backgroundColor = bodyBgDarkColor;
            } else {
              let percentage = (cur - low) / (high - low);
              let transitionColor = getTransitionColor('#ffffff', bodyBgDarkColor, percentage);
              document.body.style.backgroundColor = transitionColor;
            }
          }); // end of requestAnimationFrame
        }) // end of subscribe
    ];
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

  componentWillUnmount() {
    this.syncClient.close();
    this.subscriptions.forEach(sub => sub.unsubscribe());
    document.body.style.backgroundColor = '';
  }

  render() {
    let { viewportType, roomsSynced } = this.props;

    return (
      <SyncClientContext.Provider value={this.syncClient}>
        <div className={`App ${viewportType}`}>
          <ViewportQuery />
          <BannerList />
          <ToastList />
          <ScrollToTop />
          <Navigation />

          {roomsSynced && (
            <React.Fragment>
              <Route exact path="/" component={Home} />
              <Route exact path="/rooms" component={RoomHistory} />
              <Route exact path="/about" component={About} />
              <Route exact path="/r/:roomId" component={Room} />
            </React.Fragment>
          )}

          <Footer />
        </div>
      </SyncClientContext.Provider>
    );
  }
}

export default withRouter(connect(
  state => ({
    viewportType: state.ui.viewportType,
    viewportSize: state.newui.viewport,
    roomsSynced: state.rooms.synced
  }),
  dispatch => ({
    setScrollbarWidth(width) {
      dispatch(setScrollbarWidth(width));
    },
    setViewportSize(width, height) {
      dispatch(setViewportSize(width, height));
    },
    addDemoRoom(room) {
      dispatch(addDemoRoom(room));
    },
    syncRooms(rooms, history) {
      dispatch(syncRooms(rooms, history));
    }
  })
)(App));
