import React, { useEffect, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { useSelector } from 'react-redux';
import { EVENTS } from '../../EVENTS/events';
import { RootState } from '../../redux/store/store';
import LoadingClock from '../UI/Loading/LoadingClock';
import NoTimers from '../UI/TextComponents/NoTimers';

interface calculatedReminder {
  name: string;
  timeLeft: number;
  description?: string;
}

const TimersList: React.FC = () => {
  const { userId, socket } = useSelector(
    (state: RootState) => state.socketSlice
  );

  const [remindersList, setRemindersList] = useState<
    calculatedReminder[] | null
  >(null);

  useEffect(() => {
    if (userId && socket) {
      socket.emit(EVENTS.CLIENT.GET_TIMERS, { userId });
      socket.on(EVENTS.SERVER.ALL_TIMERS, ({ calculatedReminders }) => {
        setRemindersList(calculatedReminders);
      });
    }

    //preventing react state update on an unmounted component
    return () => setRemindersList(null);
  }, [userId, socket]);

  const renderTime = ({ remainingTime }: { remainingTime: number }) => {
    if (remainingTime === 0) {
      return null;
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
    <>
      {(!userId || !remindersList?.length) && <NoTimers />}
      {remindersList && userId ? (
        <ul>
          {remindersList.map((reminder) =>
            reminder.timeLeft ? (
              <li key={reminder.timeLeft}>
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
            ) : (
              <h4>{reminder.name} is finished</h4>
            )
          )}
        </ul>
      ) : (
        <LoadingClock />
      )}
    </>
  );
};

export default TimersList;
