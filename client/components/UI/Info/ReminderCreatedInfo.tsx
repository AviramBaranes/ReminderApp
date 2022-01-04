import Link from 'next/link';
import React from 'react';

import classes from '../../../styles/UI/ReminderCreatedInfo.module.scss';
import InfoModal from '../Modals/InfoModal';

const ReminderCreatedInfo: React.FC = () => {
  return (
    <InfoModal modalClassName={classes.Container}>
      <h3>Reminder Created Successfully</h3>
      <p>
        You can see your reminder{' '}
        <Link href='/list-timers'>
          <span>here</span>
        </Link>
      </p>
    </InfoModal>
  );
};

export default ReminderCreatedInfo;
