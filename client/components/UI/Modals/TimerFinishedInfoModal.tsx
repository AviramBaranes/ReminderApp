import React from 'react';
import ReactDOM from 'react-dom';

import classes from '../../../styles/UI/TimerFinishedInfoModal.module.scss';

const TimerFinishedInfoModal: React.FC<{
  shouldDisplay?: boolean;
}> = ({ children, shouldDisplay = true }) => {
  return ReactDOM.createPortal(
    <div
      style={{ display: shouldDisplay ? 'block' : 'none' }}
      className={classes.Modal}
    >
      {children}
    </div>,
    document.getElementById('overlays')!
  );
};

export default TimerFinishedInfoModal;
