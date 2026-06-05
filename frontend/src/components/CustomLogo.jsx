import React from 'react';

const CustomLogo = ({ size = 24, mainColor = '#ffffff', className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ overflow: 'visible' }}
  >
    <path 
      d="M 35 60 L 35 75 L 15 75 L 15 45 L 35 25 L 55 45 L 55 75" 
      stroke={mainColor} 
      strokeWidth="10" 
      strokeLinejoin="miter" 
      strokeLinecap="square" 
    />
    <path 
      d="M 45 15 L 70 40 L 70 75" 
      stroke="#C61C2A" 
      strokeWidth="10" 
      strokeLinejoin="miter" 
      strokeLinecap="square" 
    />
    <path 
      d="M 55 5 L 85 35 L 85 75" 
      stroke="#F57F20" 
      strokeWidth="10" 
      strokeLinejoin="miter" 
      strokeLinecap="square" 
    />
  </svg>
);

export default CustomLogo;
