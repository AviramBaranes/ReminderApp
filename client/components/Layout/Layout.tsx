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
  const { socket } = useSelector((state: RootState) => state.socketSlice);

  useEffect(() => {
    if (!socket) {
      const socket = openSocket(process.env.baseURL as string);
      dispatch(socketActions.newSocket({ socket }));
    } else {
      socket.on(EVENTS.SERVER.USER_CREATED, ({ userId }) => {
        document.cookie = `userId=${userId};path=/;`;
        dispatch(socketActions.newUser({ userId }));
      });
    }
  }, [socket]);

  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

export default Layout;
