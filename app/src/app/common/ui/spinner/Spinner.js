import React from 'react';

import './Spinner.css';
import spinnerImg from './spinner.png';

const Spinner = () => (
  <div className="Spinner">
    <img className="Spinner-img" src={spinnerImg} alt="loading" />
  </div>
);

export default Spinner;
