import React from 'react';
import ReactDOM from 'react-dom';

import classes from '../../../styles/UI/Modal.module.scss';

const InfoModal: React.FC<{
  modalClassName: string;
  shouldDisplay?: boolean;
}> = ({ children, modalClassName, shouldDisplay = true }) => {
  return ReactDOM.createPortal(
    <div
      style={{ display: shouldDisplay ? 'block' : 'none' }}
      className={`${modalClassName} ${classes.Modal}`}
    >
      {children}
    </div>,
    document.getElementById('overlays')!
  );
};

export default InfoModal;
