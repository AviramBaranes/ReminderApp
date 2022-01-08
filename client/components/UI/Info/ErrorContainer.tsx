import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

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
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -200 }}
      >
        <p>{errorMessage}</p>
      </motion.div>
    </InfoModal>
  ) : null;
};
export default ErrorContainer;
