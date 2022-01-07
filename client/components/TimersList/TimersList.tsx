import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { EVENTS } from '../../EVENTS/events';
import { RootState } from '../../redux/store/store';
import LoadingClock from '../UI/Loading/LoadingClock';
import NoTimers from '../UI/TextComponents/NoTimers';
import TimersListItem from './TimerListItem';

export interface CalculatedReminder {
  name: string;
  timeLeft: number;
  totalTime: number;
  description?: string;
}

const TimersList: React.FC = () => {
  const { userId, socket } = useSelector(
    (state: RootState) => state.socketSlice
  );

  const [remindersList, setRemindersList] = useState<
    CalculatedReminder[] | null
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
    <div>
      {(!userId || !remindersList?.length) && <NoTimers />}
      {remindersList && userId ? (
        <ul>
          {remindersList.map((reminder) => (
            <TimersListItem key={reminder.timeLeft} reminder={reminder} />
          ))}
        </ul>
      ) : (
        <LoadingClock />
      )}
    </div>
  );
};

export default TimersList;
