import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

import classes from '../../styles/pages/TimersList.module.scss';
import { CalculatedReminder } from './TimersList';

const TimersListItem: React.FC<{ reminder: CalculatedReminder }> = ({
  reminder,
}) => {
  const renderTime = ({ remainingTime }: { remainingTime: number }) => {
    if (remainingTime === 0) {
      return <h4>Finished</h4>;
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
    <li className={classes.ListItem}>
      <div className={classes.Content}>
        <h5>{reminder.name}</h5>
        {reminder.description && <p>{reminder.description}</p>}
      </div>
      <div className={classes.TimerCircle}>
        <CountdownCircleTimer
          isPlaying
          size={50}
          strokeWidth={2}
          duration={reminder.timeLeft! / 1000 || 0}
          colors='#0fc4b2'
        >
          {renderTime}
        </CountdownCircleTimer>
      </div>
    </li>
  );
};

export default TimersListItem;
