import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { EVENTS } from '../../EVENTS/events';
import { RootState } from '../../redux/store/store';
import LoadingClock from '../UI/LoadingClock';
import NoTimers from '../UI/NoTimers';

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

  return (
    <>
      {!userId && <NoTimers />}
      {remindersList && userId ? (
        <ul>
          {remindersList.map((reminder) => (
            <li key={reminder.timeLeft}>
              <h4>{reminder.name}</h4>
              <p>{reminder.timeLeft}</p>
              {reminder.description && <p>{reminder.description}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <LoadingClock />
      )}
    </>
  );
};

export default TimersList;
