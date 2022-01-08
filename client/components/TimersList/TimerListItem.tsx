import React, { useEffect, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { motion } from 'framer-motion';

import classes from '../../styles/pages/TimersList.module.scss';
import { CalculatedReminder } from './TimersList';

const TimersListItem: React.FC<{
  reminder: CalculatedReminder;
  index: number;
}> = ({ reminder, index }) => {
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsFinished(true), reminder.timeLeft + 1000);
  }, []);

  const renderTime = ({ remainingTime }: { remainingTime: number }) => {
    if (remainingTime === 0) {
      return <h4>Finished!</h4>;
    }
    //format time
    const hours = String(Math.floor(remainingTime / 3600)).padStart(2, '0');
    const minutes = String(
      Math.floor((remainingTime - +hours * 3600) / 60)
    ).padStart(2, '0');
    const seconds = String(
      remainingTime - +hours * 3600 - +minutes * 60
    ).padStart(2, '0');

    return (
      <div>
        <p className={classes.Time}>
          {hours}:{minutes}:{seconds}
        </p>
      </div>
    );
  };

  return (
    <motion.li
      initial={{ x: '50%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{ display: isFinished ? 'none' : 'default' }}
      className={classes.ListItem}
    >
      <div className={classes.Content}>
        <h5>{reminder.name}</h5>
        {reminder.description && <p>{reminder.description}</p>}
      </div>
      <div className={classes.TimerCircle}>
        <CountdownCircleTimer
          initialRemainingTime={reminder.timeLeft! / 1000 || 0}
          isPlaying
          size={50}
          strokeWidth={2}
          duration={reminder.totalTime}
          colors='#0fc4b2'
        >
          {renderTime}
        </CountdownCircleTimer>
      </div>
    </motion.li>
  );
};

export default TimersListItem;
