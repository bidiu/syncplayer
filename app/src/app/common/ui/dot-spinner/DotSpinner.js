import React from "react";

import './DotSpinner.css';

const DotSpinner = ({ width = 180, height = 90 }) => (
  <svg className="DotSpinner lds-message" width={width} height={height}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style={{ animationPlayState: 'running', animationDelay: '0s', background: 'none' }}>
    <g transform="translate(20 50)" style={{ animationPlayState: 'running', animationDelay: '0s' }}>
      <circle cx="0" cy="0" r="5" fill="#69b7ec" transform="scale(0.201316 0.201316)" style={{ animationPlayState: 'running', animationDelay: '0s' }}>
        <animateTransform attributeName="transform" type="scale" begin="-0.375s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" style={{ animationPlayState: 'running', animationDelay: '0s' }}></animateTransform>
      </circle>
    </g>
    <g transform="translate(40 50)" style={{ animationPlayState: 'running', animationDelay: '0s' }}>
      <circle cx="0" cy="0" r="5" fill="#486e89" transform="scale(0.00256147 0.00256147)" style={{ animationPlayState: 'running', animationDelay: '0s' }}>
        <animateTransform attributeName="transform" type="scale" begin="-0.25s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" style={{ animationPlayState: 'running', animationDelay: '0s' }}></animateTransform>
      </circle>
    </g>
    <g transform="translate(60 50)" style={{ animationPlayState: 'running', animationDelay: '0s' }}>
      <circle cx="0" cy="0" r="5" fill="#ac7ad0" transform="scale(0.134436 0.134436)" style={{ animationPlayState: 'running', animationDelay: '0s' }}>
        <animateTransform attributeName="transform" type="scale" begin="-0.125s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" style={{ animationPlayState: 'running', animationDelay: '0s' }}></animateTransform>
      </circle>
    </g>
    <g transform="translate(80 50)" style={{ animationPlayState: 'running', animationDelay: '0s' }}>
      <circle cx="0" cy="0" r="5" fill="#f99a5a" transform="scale(0.455783 0.455783)" style={{ animationPlayState: 'running', animationDelay: '0s' }}>
        <animateTransform attributeName="transform" type="scale" begin="0s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" style={{ animationPlayState: 'running', animationDelay: '0s' }}></animateTransform>
      </circle>
    </g>
  </svg>
);

export default DotSpinner;
