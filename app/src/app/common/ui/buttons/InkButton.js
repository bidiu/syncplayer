import React from 'react';
import Button from './Button';

import './InkButton.css';

const InkButton = ({ onClick, children }) => (
  <Button className="InkButton" onClick={onClick}>
    {children}
  </Button>
);

export default InkButton;
