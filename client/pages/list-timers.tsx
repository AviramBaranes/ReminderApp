import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import TimersList from '../components/TimersList/TimersList';
import Title from '../components/UI/TextComponents/Title';

const pageVariants = {
  hidden: {
    opacity: 0,
    x: '100vw',
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', duration: 0.5 },
  },
  exit: {
    x: '100vw',
    transition: { ease: 'easeInOut' },
  },
};

const timerList: React.FC = () => {
  return (
    <motion.div
      variants={pageVariants}
      animate='visible'
      initial='hidden'
      exit='exit'
    >
      <Title
        header='Reminders List'
        paragraph='A list of all current working timers'
      />
      <TimersList />
    </motion.div>
  );
};

export default timerList;
