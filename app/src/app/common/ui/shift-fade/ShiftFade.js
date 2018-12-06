import React from 'react';
import { CSSTransition } from 'react-transition-group';

import './ShiftFade.css';

const ShiftFade = ({ children, classNames="ShiftFade", timeout = 1000, ...props }) => (
  <CSSTransition
    appear={true}
    mountOnEnter={true}
    unmountOnExit={true}
    classNames={classNames}
    timeout={timeout}
    {...props}>
    {children}
  </CSSTransition>
);

export default ShiftFade;
