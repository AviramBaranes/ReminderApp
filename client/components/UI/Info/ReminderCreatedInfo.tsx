import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';

import classes from '../../../styles/UI/ReminderCreatedInfo.module.scss';
import InfoModal from '../Modals/InfoModal';

const ReminderCreatedInfo: React.FC = () => {
  return (
    <InfoModal modalClassName={classes.Container}>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -200 }}
      >
        <h3>Reminder Created!</h3>
        <p>
          You can see your reminder{' '}
          <Link href='/list-timers'>
            <span>here</span>
          </Link>
        </p>
      </motion.div>
    </InfoModal>
  );
};

export default ReminderCreatedInfo;
