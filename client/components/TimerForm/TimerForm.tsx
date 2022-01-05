import React, { SetStateAction, useState } from 'react';
import { useSelector } from 'react-redux';
import { EVENTS } from '../../EVENTS/events';
import { RootState } from '../../redux/store/store';
import { Reminder } from '../../types/Reminder';

interface Time {
  hours: string;
  minutes: string;
  seconds: string;
}

const TimerForm: React.FC<{
  setShowInfoModal: React.Dispatch<SetStateAction<boolean>>;
}> = ({ setShowInfoModal }) => {
  const { socket, userId } = useSelector(
    (state: RootState) => state.socketSlice
  );

  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState<Time>({
    hours: '',
    minutes: '',
    seconds: '',
  });

  const { hours, minutes, seconds } = time;

  function timeInputChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, name } = e.target;
    const maxNumber = name === 'hours' ? 23 : 59;
    let newValue = value;

    if (value.length > 2) {
      newValue = value.substring(1);
    }

    if (+value < 9) {
      setTime((prev) => ({ ...prev, [name]: newValue.padStart(2, '0') }));
    } else if (+value > maxNumber) {
      setTime((prev) => ({ ...prev, [name]: maxNumber }));
    } else {
      setTime((prev) => ({ ...prev, [name]: newValue }));
    }
  }

  function formSubmitHandler(e: React.FormEvent) {
    e.preventDefault();

    setError('');

    if (name.length < 2) {
      setError('Title is too short');
      return;
    }
    if (name.length > 15) {
      setError('Title is too long');
      return;
    }

    const timeInSeconds = +seconds + +minutes * 60 + +hours * 3600;
    if (timeInSeconds > 86_400) {
      setError('Timer is too long');
      return;
    }
    if (!socket) {
      //handler error
      return;
    }

    const payload: Reminder = {
      name,
      date: new Date(),
      time: timeInSeconds,
    };

    if (description) payload.description = description;
    if (userId) payload.userId = userId;

    socket.emit(EVENTS.CLIENT.NEW_TIMER, payload);
    socket.on(EVENTS.SERVER.TIMER_CREATED, () => {
      setShowInfoModal(true);

      setTimeout(() => setShowInfoModal(false), 3000);
    });
  }

  return (
    <form onSubmit={formSubmitHandler}>
      <p>{error}</p>
      <div className='input-container'>
        <input
          type='text'
          name='name'
          id='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor='name'>title</label>
      </div>
      <fieldset>
        <div className='input-container'>
          <input
            onChange={timeInputChangeHandler}
            type='number'
            name='hours'
            id='hours'
            value={hours}
          />
          <label htmlFor='hours'>hours</label>
        </div>
        <div className='input-container'>
          <input
            onChange={timeInputChangeHandler}
            type='number'
            name='minutes'
            id='minutes'
            value={minutes}
          />
          <label htmlFor='minutes'>minutes</label>
        </div>
        <div className='input-container'>
          <input
            onChange={timeInputChangeHandler}
            type='number'
            name='seconds'
            id='seconds'
            value={seconds}
          />
          <label htmlFor='seconds'>seconds</label>
        </div>
      </fieldset>
      <div className='input-container'>
        <textarea
          name='description'
          onChange={(e) => setDescription(e.target.value)}
          id='description'
          cols={30}
          rows={10}
          value={description}
        ></textarea>
        <label htmlFor='description'>description</label>
      </div>
      <button type='submit'>start</button>
    </form>
  );
};

export default TimerForm;