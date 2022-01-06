import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import classes from '../../../styles/UI/ErrorContainer.module.scss';
import { EVENTS } from '../../../EVENTS/events';
import { RootState } from '../../../redux/store/store';
import InfoModal from '../Modals/InfoModal';

const ErrorContainer: React.FC = () => {
  const { socket } = useSelector((state: RootState) => state.socketSlice);

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!socket) return;
    socket.on(EVENTS.SERVER.ERROR, ({ message }) => {
      setErrorMessage(message);
      setHasError(true);

      setTimeout(() => setHasError(false), 3000);
    });
  }, [socket]);

  return hasError ? (
    <InfoModal modalClassName={classes.Container}>
      <p>{errorMessage}</p>
    </InfoModal>
  ) : null;
};
export default ErrorContainer;
