import React from 'react';
import { CSSTransition } from 'react-transition-group';

import './ExpandFade.css';

/**
 * The `className` you provide will override the default class name.
 */
const ExpandFade = ({ children, className="ExpandFade", timeout = 1000, ...props }) => (
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

export default ExpandFade;
