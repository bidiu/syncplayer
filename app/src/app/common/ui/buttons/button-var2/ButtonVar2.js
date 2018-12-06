import React from 'react';

import './ButtonVar2.css';

const ButtonVar2 = ({ className, children, ...props }) => (
  <button 
    className={`ButtonVar2 ${className || ''}`} 
    {...props}>
    {children}
  </button>
);

export default ButtonVar2;
