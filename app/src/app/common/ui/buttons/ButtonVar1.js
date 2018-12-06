import React from 'react';
import Button from './Button';

import './ButtonVar1.css';

/**
 * You can style the generated button by passing a class name(s) with
 * `className` prop.
 * 
 * Note that before passing class name(s), have a look at the style sheets
 * of this component and underlying `Button` component. If you want to overwrite
 * syles set by these style sheets, you MUST use `!important` together with
 * your css rules.
 */
const ButtonVar1 = ({ onClick, className, disable, disableClass = 'ButtonVar1-disable', children }) => (
  <Button className={`ButtonVar1 ${className || ''}`}
    disable={disable} disableClass={disableClass} onClick={onClick}>
    {children}
  </Button>
);

export default ButtonVar1;
