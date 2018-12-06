import React from 'react';
import { CSSTransition } from 'react-transition-group';

import './FakeExpandFade.css';

/**
 * The `className` you provide will override the default class name.
 */
const FakeExpandFade = ({ children, className="FakeExpandFade", timeout = 1000, ...props }) => (
  <CSSTransition
    appear={true}
    mountOnEnter={true}
    unmountOnExit={true}
    classNames={className}
    timeout={timeout}
    {...props}>
    {children}
  </CSSTransition>
);

export default FakeExpandFade;
