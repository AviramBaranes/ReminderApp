import { NextPage } from 'next';
import TimerForm from '../components/TimerForm/TimerForm';

import Title from '../components/UI/Title';

const timer: NextPage = () => {
  return (
    <>
      <Title header='New Reminder' paragraph='Create a new Reminder' />
      <TimerForm />
    </>
  );
};

export default timer;
