import React from 'react';

import './ButtonLink.css';

const ButtonLink = ({ className, children, ...props }) => (
  <button
    className={`ButtonLink ${className || ''}`}
    {...props}>
    {children}
  </button>
);

export default ButtonLink;
