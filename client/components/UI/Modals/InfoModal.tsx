import React from 'react';
import ReactDOM from 'react-dom';

const InfoModal: React.FC<{ modalClassName: string; shouldDisplay?: boolean }> =
  ({ children, modalClassName, shouldDisplay = true }) => {
    return ReactDOM.createPortal(
      <div
        style={{ display: shouldDisplay ? 'block' : 'none' }}
        className={modalClassName}
      >
        {children}
      </div>,
      document.getElementById('overlays')!
    );
  };

export default InfoModal;
