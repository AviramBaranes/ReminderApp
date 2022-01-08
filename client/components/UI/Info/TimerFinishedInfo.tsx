import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { motion } from 'framer-motion';

import classes from '../../../styles/UI/TimerFinishedInfoModal.module.scss';

interface TimerFinishedInfoProps {
  setNumberOfFinishedTimers: React.Dispatch<SetStateAction<number>>;
  done: boolean;
  name: string;
  timeLeft?: number;
}

const TimerCardVariant = {
  hidden: {
    x: '100%',
  },
  visible: {
    x: 0,
    transition: {
      duration: 0.65,
      type: 'spring',
    },
  },
};

const TimerFinishedInfo: React.FC<TimerFinishedInfoProps> = ({
  name,
  done,
  timeLeft,
  setNumberOfFinishedTimers,
}) => {
  const [finishedTimer, setFinishedTimer] = useState(false);
  const [shouldDisplay, setShouldDisplay] = useState(true);
  const [shouldAnimateExit, setShouldAnimateExit] = useState(false);

  useEffect(() => {
    if (finishedTimer) setNumberOfFinishedTimers((prev) => prev + 1);

    return () => setShouldDisplay(false);
  }, [finishedTimer]);

  setTimeout(() => {
    setShouldAnimateExit(true);
    setTimeout(() => {
      setFinishedTimer(true);
      setShouldDisplay(false);
    }, 400);
  }, timeLeft || 0 + 1000);

  const renderTime = ({ remainingTime }: { remainingTime: number }) => {
    if (remainingTime === 0) {
      return (
        <div className={classes.TimerContent}>
          <h4>Finished!</h4>
        </div>
      );
    }
    return (
      <div className={classes.TimerContent}>
        <h4>{remainingTime}</h4>
        <p>Seconds Left</p>
      </div>
    );
  };

  return (
    <motion.div
      className={shouldAnimateExit ? classes.OutAnimation : ''}
      variants={TimerCardVariant}
      animate='visible'
      initial='hidden'
      style={{ display: shouldDisplay ? 'block' : 'none' }}
    >
      {done ? (
        <div className={classes.TimerCard}>
          <h4>{name} is finished</h4>
        </div>
      ) : (
        <div className={classes.TimerCard}>
          <p className={classes.Title}>{name} is about to be finished</p>
          <div className={classes.CircleTimer}>
            <CountdownCircleTimer
              size={60}
              strokeWidth={3}
              isPlaying
              duration={timeLeft! / 1000}
              colors='#FF3131'
            >
              {renderTime}
            </CountdownCircleTimer>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TimerFinishedInfo;
