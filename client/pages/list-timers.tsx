import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TimersList from '../components/TimersList/TimersList';
import LoadingClock from '../components/UI/Loading/LoadingClock';
import NoTimers from '../components/UI/TextComponents/NoTimers';
import Title from '../components/UI/TextComponents/Title';
import { EVENTS } from '../EVENTS/events';
import { RootState } from '../redux/store/store';

const timerList: React.FC = () => {
  return (
    <>
      <Title
        header='Reminders List'
        paragraph='A list of all current working timers'
      />
      <TimersList />
    </>
  );
};

export default timerList;
