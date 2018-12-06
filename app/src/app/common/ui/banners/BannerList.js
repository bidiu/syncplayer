import React from 'react';
import { connect } from "react-redux";
import { TransitionGroup } from 'react-transition-group';
import Fade from '../fade/Fade';
import Banner from './Banner';
import MobileBanner from './MobileBanner';
import { TYPE_BANNER } from '../../state/notifications/reducer';
import { VIEWPORT_MOBILE } from '../../state/ui/reducer';

import './BannerList.css';

/**
 * presentational component
 */
const BannerList = ({ entries, viewportType, displayLimit = 2 }) => {
  if (viewportType === VIEWPORT_MOBILE) { displayLimit = 1; }
  let entriesToDisplay = entries.slice(0, displayLimit).reverse();
  let fadeClassNames = viewportType === VIEWPORT_MOBILE ? 
    'MobileBanner-Fade' : 
    'Banner-Fade';

  return (
    <div className="BannerList">
      <TransitionGroup>
        {entriesToDisplay.map(entry => (
          <Fade key={entry.id} classNames={fadeClassNames}>
            {viewportType === VIEWPORT_MOBILE ?
              <MobileBanner entry={entry} /> :
              <Banner entry={entry} />
            }
          </Fade>
        ))}
      </TransitionGroup>
    </div>
  );
}

export default connect(
  state => ({
    entries: state.notifications.filter(entry => entry.type === TYPE_BANNER),
    viewportType: state.ui.viewportType
  }),
  dispatch => ({})
)(BannerList);
