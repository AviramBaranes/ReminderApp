import React from 'react';

const ClockLogoSvg: React.FC = () => {
  return (
    <svg width={25} height={25}>
      <circle cx={12.5} cy={12.5} r={11} stroke='black' fill='transparent' />
      <line
        x1={12.5}
        y1={12.5}
        x2={12.5}
        y2={5}
        strokeWidth={1}
        stroke='black'
      />
      <line
        x1={12.5}
        y1={12.5}
        x2={17.5}
        y2={20}
        strokeWidth={1}
        stroke='black'
      />
    </svg>
  );
};

export default ClockLogoSvg;
