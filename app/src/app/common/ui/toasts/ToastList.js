import React from 'react';
import { connect } from "react-redux";
import { TransitionGroup } from 'react-transition-group';
import Fade from '../fade/Fade';
import Toast from './Toast';
import { TYPE_TOAST } from '../../state/notifications/reducer'

import './ToastList.css';

/**
 * Even this is called `ToastList`, only one toast could show
 * up at a time (at least by default).
 */
const ToastList = ({ entries, displayLimit = 1 }) => {
  let entriesToDisplay = entries.slice(0, displayLimit).reverse();

  return (
    <div className="ToastList">
      <TransitionGroup>
        {entriesToDisplay.map(entry => (
          <Fade key={entry.id}>
            {<Toast entry={entry} />}
          </Fade>
        ))}
      </TransitionGroup>
    </div>
  );
};

export default connect(
  state => ({
    entries: state.notifications.filter(entry => entry.type === TYPE_TOAST)
  }),
  dispatch => ({})
)(ToastList);
