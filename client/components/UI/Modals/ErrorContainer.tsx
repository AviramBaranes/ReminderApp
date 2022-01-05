import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { EVENTS } from '../../../EVENTS/events';
import { RootState } from '../../../redux/store/store';
import ErrorModal from './ErrorModal';

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
    <ErrorModal>
      <p>{errorMessage}</p>
    </ErrorModal>
  ) : null;
};
export default ErrorContainer;
