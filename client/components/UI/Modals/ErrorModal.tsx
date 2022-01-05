import React from 'react';
import ReactDom from 'react-dom';

const ErrorModal: React.FC = ({ children }) => {
  return ReactDom.createPortal(
    <div>{children}</div>,
    document.getElementById('overlays')!
  );
};

export default ErrorModal;
