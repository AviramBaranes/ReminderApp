import React, { SetStateAction } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

import classes from '../../../styles/UI/TimerFinishedInfo.module.scss';
import InfoModal from '../Modals/InfoModal';

interface TimerFinishedInfoProps {
  setShowModal: React.Dispatch<SetStateAction<boolean>>;
  done: boolean;
  name: string;
  timeLeft?: number;
}

const TimerFinishedInfo: React.FC<TimerFinishedInfoProps> = ({
  name,
  done,
  timeLeft,
  setShowModal,
}) => {
  const renderTime = ({ remainingTime }: { remainingTime: number }) => {
    if (remainingTime === 0) {
      return setShowModal(true);
    }
    return (
      <div>
        <h2>{remainingTime}</h2>
        <p>Seconds Remaining</p>
      </div>
    );
  };

  const NotFinishedReminder = (
    <>
      <h4>{name} is about to finish</h4>
      <CountdownCircleTimer
        isPlaying
        duration={timeLeft!}
        colors={[
          ['#004777', 0.33],
          ['#F7B801', 0.33],
          ['#A30000', 0.33],
        ]}
      >
        {renderTime}
      </CountdownCircleTimer>
    </>
  );

  return (
    <InfoModal modalClassName={classes.Container}>
      {done ? <h4>{name} is finished</h4> : { NotFinishedReminder }}
    </InfoModal>
  );
};

export default TimerFinishedInfo;
