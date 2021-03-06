import Head from 'next/head';
import { useEffect, useState } from 'react';
import openSocket from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';

import Navigation from './Navigation';
import { RootState } from '../../redux/store/store';
import { socketActions } from '../../redux/slices/socketSlice';
import { EVENTS } from '../../EVENTS/events';
import TimersFinishedList, {
  FinishedTimer,
} from '../UI/Info/TimersFinishedList';

const Layout: React.FC = ({ children }) => {
  const dispatch = useDispatch();
  const [isNewUser, setIsNewUser] = useState(true);
  const [showModals, setShowModals] = useState(false);
  const [finishedTimersList, setFinishedTimersList] = useState<FinishedTimer[]>(
    []
  );

  const { socket, userId } = useSelector(
    (state: RootState) => state.socketSlice
  );

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
      const userIdFromCookie = localStorage.getItem('userId');
      if (userIdFromCookie) {
        setIsNewUser(false);
        dispatch(socketActions.newUser({ userId: userIdFromCookie }));
      } else {
        socket.on(EVENTS.SERVER.USER_CREATED, ({ userId }) => {
          localStorage.setItem('userId', userId);
          dispatch(socketActions.newUser({ userId }));
        });
      }
    }
  }, [socket]);

  //listen and broadcast events
  useEffect(() => {
    if (!socket || !userId) return;

    //not depending on the resolve/reject value
    fetch(`${process.env.baseURL}/cleanup`, {
      method: 'PUT',
      body: JSON.stringify({ userId }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then()
      .catch((err) => {
        console.log('[cleanup route]', err);
      });

    socket.emit(EVENTS.CLIENT.CHECK_FOR_FINISHED_TIMERS, { userId });
    socket.on(EVENTS.SERVER.TIMER_DONE, ({ name, timeLeft, done }) => {
      //if new user reminder will be called twice
      if (isNewUser) {
        setIsNewUser(false);
      } else {
        setFinishedTimersList((prevState) => [
          ...prevState,
          { name, timeLeft, done },
        ]);
        setShowModals(true);
      }
    });
  }, [userId, isNewUser]);

  return (
    <>
      <Head>
        <title>Reminders</title>
        <link rel='icon' href='app-icon.png' />
      </Head>
      {showModals && (
        <TimersFinishedList
          finishedTimersList={finishedTimersList}
          setFinishedTimersList={setFinishedTimersList}
          setShowModals={setShowModals}
          showModals={showModals}
        />
      )}
      <Navigation />
      <main>{children}</main>
    </>
  );
};

export default Layout;
