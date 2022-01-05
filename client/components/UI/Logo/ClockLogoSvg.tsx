import React from 'react';

const ClockLogoSvg: React.FC = () => {
  return (
    <svg width={100} height={100}>
      <circle cx={50} cy={50} r={45} stroke='black' fill='transparent' />
      <line x1={50} y1={50} x2={50} y2={25} strokeWidth={2} stroke='black' />
      <line x1={50} y1={50} x2={70} y2={80} strokeWidth={2} stroke='black' />
      <text x={45} y={15} fontSize={10} fontWeight='bold'>
        XII
      </text>
      <text x={80} y={50} fontSize={10} fontWeight='bold'>
        III
      </text>
      <text x={46} y={90} fontSize={10} fontWeight='bold'>
        VI
      </text>
      <text x={10} y={50} fontSize={10} fontWeight='bold'>
        IX
      </text>
    </svg>
  );
};

export default ClockLogoSvg;
