import React from 'react';
import DotSpinner from '../dot-spinner/DotSpinner';

import './DotSpinnerVar1.css';

/**
 * both `width` and `height` are optional. If not provided, they will use
 * the default value of underlying `DotSpinner`.
 * 
 * The text's style will inherit from enclosing elements. To customize styling
 * of text, you can optionally pass class names by using the prop `className`.
 */
const DotSpinnerVar1 = ({ width, height, text = 'Loading...', className = '' }) => (
  <div className={`DotSpinnerVar1 ${className}`}>
    <DotSpinner width={width} height={height} />
    <span className="dsv1-text">{text}</span>
  </div>
);

export default DotSpinnerVar1;
