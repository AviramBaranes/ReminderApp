import { NextPage } from 'next';
import { useState } from 'react';
import TimerForm from '../components/TimerForm/TimerForm';
import ReminderCreatedInfo from '../components/UI/Info/ReminderCreatedInfo';

import Title from '../components/UI/TextComponents/Title';

const timer: NextPage = () => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <>
      {showInfoModal && <ReminderCreatedInfo />}
      <Title header='New Reminder' paragraph='Create a new Reminder' />
      <TimerForm setShowInfoModal={setShowInfoModal} />
    </>
  );
};

export default timer;
