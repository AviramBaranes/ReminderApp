import React from 'react';
import ReactDOM from 'react-dom';

const InfoModal: React.FC<{ modalClassName: string }> = ({
  children,
  modalClassName,
}) => {
  return ReactDOM.createPortal(
    <div className={modalClassName}>{children}</div>,
    document.getElementById('overlays')!
  );
};

export default InfoModal;
