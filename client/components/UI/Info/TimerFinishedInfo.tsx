import React, { SetStateAction, useEffect, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

import classes from '../../../styles/UI/TimerFinishedInfoModal.module.scss';
import InfoModal from '../Modals/InfoModal';
import TimerFinishedInfoModal from '../Modals/TimerFinishedInfoModal';

interface TimerFinishedInfoProps {
  setNumberOfFinishedTimers: React.Dispatch<SetStateAction<number>>;
  done: boolean;
  name: string;
  timeLeft?: number;
}

const TimerFinishedInfo: React.FC<TimerFinishedInfoProps> = ({
  name,
  done,
  timeLeft,
  setNumberOfFinishedTimers,
}) => {
  const [finishedTimer, setFinishedTimer] = useState(false);
  const [shouldDisplay, setShouldDisplay] = useState(true);

  useEffect(() => {
    if (finishedTimer) setNumberOfFinishedTimers((prev) => prev + 1);

    return () => setShouldDisplay(false);
  }, [finishedTimer]);

  setTimeout(() => {
    setFinishedTimer(true);
    setShouldDisplay(false);
  }, (timeLeft || 0) + 700);

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
    <div style={{ display: shouldDisplay ? 'block' : 'none' }}>
      {done ? (
        <h4>{name} is finished</h4>
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
    </div>
  );
};

export default TimerFinishedInfo;
