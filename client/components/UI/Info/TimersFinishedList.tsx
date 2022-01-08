import React, { SetStateAction, useEffect, useState } from 'react';

import TimerFinishedInfoModal from '../Modals/TimerFinishedInfoModal';
import TimerFinishedInfo from './TimerFinishedInfo';

interface TimersFinishedListProps {
  setShowModals: React.Dispatch<SetStateAction<boolean>>;
  setFinishedTimersList: React.Dispatch<SetStateAction<FinishedTimer[]>>;
  finishedTimersList: FinishedTimer[];
  showModals: boolean;
}

export interface FinishedTimer {
  done: boolean;
  name: string;
  timeLeft?: number;
}

const TimersFinishedList: React.FC<TimersFinishedListProps> = ({
  setShowModals,
  finishedTimersList,
  setFinishedTimersList,
  showModals,
}) => {
  const [numberOfFinishedTimers, setNumberOfFinishedTimers] = useState(0);

  useEffect(() => {
    if (numberOfFinishedTimers === finishedTimersList.length) {
      setFinishedTimersList([]);
      setShowModals(false);
    }
  }, [numberOfFinishedTimers]);

  return (
    <TimerFinishedInfoModal shouldDisplay={showModals}>
      {finishedTimersList.map((finishedTimerData, i) => (
        <TimerFinishedInfo
          key={(finishedTimerData.timeLeft || 0) + i}
          done={finishedTimerData!.done}
          timeLeft={finishedTimerData?.timeLeft}
          name={finishedTimerData!.name}
          setNumberOfFinishedTimers={setNumberOfFinishedTimers}
        />
      ))}
    </TimerFinishedInfoModal>
  );
};

export default TimersFinishedList;
