import React from 'react';

import './LineDelimiter.css';

const LineDelimiter = ({ className, style = {} }) => (
  <div className={`LineDelimiter ${className}`} style={style}></div>
);

export default LineDelimiter;
