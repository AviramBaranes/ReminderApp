import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
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
        <p>
          {hours}:{minutes}:{seconds}
        </p>
      </div>
    );
  };

  return (
    <li>
      <div>
        <h4>{reminder.name}</h4>
        {reminder.description && <p>{reminder.description}</p>}
      </div>
      <CountdownCircleTimer
        isPlaying
        duration={reminder.timeLeft! / 1000 || 0}
        colors={[
          ['#004777', 0.33],
          ['#F7B801', 0.33],
          ['#A30000', 0.33],
        ]}
      >
        {renderTime}
      </CountdownCircleTimer>
    </li>
  );
};

export default TimersListItem;
