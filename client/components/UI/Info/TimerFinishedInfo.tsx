import React, { SetStateAction, useEffect, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

import classes from '../../../styles/UI/TimerFinishedInfo.module.scss';
import InfoModal from '../Modals/InfoModal';

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
  }, timeLeft);

  const renderTime = ({ remainingTime }: { remainingTime: number }) => {
    return (
      <div>
        <h2>{remainingTime}</h2>
        <p>Seconds Remaining</p>
      </div>
    );
  };

  return (
    <InfoModal shouldDisplay={shouldDisplay} modalClassName={classes.Container}>
      {done ? (
        <h4>{name} is finished</h4>
      ) : (
        <>
          <h4>{name} is about to finish</h4>
          <CountdownCircleTimer
            isPlaying
            duration={timeLeft! / 1000}
            colors={[
              ['#004777', 0.33],
              ['#F7B801', 0.33],
              ['#A30000', 0.33],
            ]}
          >
            {renderTime}
          </CountdownCircleTimer>
        </>
      )}
    </InfoModal>
  );
};

export default TimerFinishedInfo;
