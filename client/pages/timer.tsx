import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import TimerForm from '../components/TimerForm/TimerForm';
import ReminderCreatedInfo from '../components/UI/Info/ReminderCreatedInfo';
import Title from '../components/UI/TextComponents/Title';

const pageVariants = {
  hidden: {
    opacity: 0,
    x: '-100vw',
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', duration: 0.5 },
  },
  exit: {
    x: '-100vw',
    transition: { ease: 'easeInOut' },
  },
};

const timer: NextPage = () => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => () => setShowInfoModal(false), []);

  return (
    <motion.div
      variants={pageVariants}
      animate='visible'
      initial='hidden'
      exit='exit'
    >
      {showInfoModal && <ReminderCreatedInfo />}
      <Title header='New Reminder' paragraph='Create a new Reminder' />
      <TimerForm setShowInfoModal={setShowInfoModal} />
    </motion.div>
  );
};

export default timer;
