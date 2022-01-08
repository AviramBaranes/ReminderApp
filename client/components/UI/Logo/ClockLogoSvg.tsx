import React from 'react';
import { motion } from 'framer-motion';

const circleVariant = {
  hidden: {
    opacity: 0,
    pathLength: 0,
  },
  visible: {
    opacity: 1,
    pathLength: 1,
    transition: {
      duration: 1,
      ease: 'easeInOut',
    },
  },
};

const lineVariant = {
  hidden: {
    rotate: -360,
  },
  visible: {
    rotate: 0,
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
    },
  },
};

const secondLineVariant = {
  hidden: {
    rotate: -90,
  },
  visible: {
    rotate: 0,
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
    },
  },
};

const ClockLogoSvg: React.FC = () => {
  return (
    <svg width={25} height={25}>
      <motion.circle
        variants={circleVariant}
        animate='visible'
        initial='hidden'
        cx={12.5}
        cy={12.5}
        r={11}
        stroke='black'
        fill='transparent'
      />
      <motion.line
        style={{ originX: 1, originY: 1 }}
        variants={lineVariant}
        x1={12.5}
        y1={12.5}
        x2={12.5}
        y2={5}
        strokeWidth={1}
        stroke='black'
      />
      <motion.line
        variants={secondLineVariant}
        style={{ originX: 0, originY: 0 }}
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
