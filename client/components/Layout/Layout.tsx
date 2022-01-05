import { NextComponentType } from 'next';
import { useEffect, useState } from 'react';
import openSocket from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';

import Navigation from './Navigation';
import { RootState } from '../../redux/store/store';
import { socketActions } from '../../redux/slices/socketSlice';
import { EVENTS } from '../../EVENTS/events';
import TimerFinishedInfo from '../UI/Info/TimerFinishedInfo';
import TimersFinishedList, {
  FinishedTimer,
} from '../UI/Info/TimersFinishedList';

const Layout: React.FC = ({ children }) => {
  const dispatch = useDispatch();
  const [showModals, setShowModals] = useState(false);
  const [finishedTimersList, setFinishedTimersList] = useState<FinishedTimer[]>(
    []
  );

  const { socket, userId } = useSelector(
    (state: RootState) => state.socketSlice
  );

  function getUserIdCookie() {
    const cookies = document.cookie.split(';');
    for (const item of cookies) {
      if (item.startsWith('userId=')) {
        return item.substr(7);
      }
    }
  }

  //get socket connection
  useEffect(() => {
    if (!socket) {
      const socket = openSocket(process.env.baseURL as string);
      dispatch(socketActions.newSocket({ socket }));
    }
  }, []);

  //get userId
  useEffect(() => {
    if (!socket) return;
    if (!userId) {
      const userIdFromCookie = getUserIdCookie();
      if (userIdFromCookie) {
        dispatch(socketActions.newUser({ userId: userIdFromCookie }));
      } else {
        socket.on(EVENTS.SERVER.USER_CREATED, ({ userId }) => {
          document.cookie = `userId=${userId};path=/;`;
          dispatch(socketActions.newUser({ userId }));
        });
      }
    }
  }, [socket]);

  //listen and broadcast events
  useEffect(() => {
    if (!socket || !userId) return;

    socket.emit(EVENTS.CLIENT.CHECK_FOR_FINISHED_TIMERS, { userId });
    socket.on(EVENTS.SERVER.TIMER_DONE, ({ name, timeLeft, done }) => {
      setFinishedTimersList((prevState) => [
        ...prevState,
        { name, timeLeft, done },
      ]);
      setShowModals(true);
      console.log({ name, timeLeft, done });
    });
  }, [userId]);

  return (
    <>
      {showModals && (
        <TimersFinishedList
          finishedTimersList={finishedTimersList}
          setFinishedTimersList={setFinishedTimersList}
          setShowModals={setShowModals}
        />
      )}
      <Navigation />
      {children}
    </>
  );
};

export default Layout;
