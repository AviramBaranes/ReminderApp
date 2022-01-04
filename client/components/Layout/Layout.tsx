import { NextComponentType } from 'next';
import { useEffect } from 'react';
import openSocket from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';

import Navigation from './Navigation';
import { RootState } from '../../redux/store/store';
import { socketActions } from '../../redux/slices/socketSlice';
import { EVENTS } from '../../EVENTS/events';

const Layout: React.FC = ({ children }) => {
  const dispatch = useDispatch();
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

  useEffect(() => {
    if (!socket) {
      const socket = openSocket(process.env.baseURL as string);
      dispatch(socketActions.newSocket({ socket }));
    }
    //
    else {
      socket.on(EVENTS.SERVER.TIMER_DONE, ({ name }) => {
        console.log(name);
      });
      if (userId) {
        socket.emit(EVENTS.CLIENT.CHECK_FOR_FINISHED_TIMERS, { userId });
      }
      //
      else {
        const userIdFromCookie = getUserIdCookie();

        if (userIdFromCookie) {
          dispatch(socketActions.newUser({ userId: userIdFromCookie }));
        }
        //
        else {
          socket.on(EVENTS.SERVER.USER_CREATED, ({ userId }) => {
            document.cookie = `userId=${userId};path=/;`;
            dispatch(socketActions.newUser({ userId }));
          });
        }
      }
    }
  }, [socket, userId]);

  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

export default Layout;
