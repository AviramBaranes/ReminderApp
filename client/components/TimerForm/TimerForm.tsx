import React, { SetStateAction, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import classes from '../../styles/pages/TimerForm.module.scss';
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
  const [nameValidity, setNameValidity] = useState({
    touched: false,
    valid: false,
  });
  const [description, setDescription] = useState('');
  const [time, setTime] = useState<Time>({
    hours: '',
    minutes: '',
    seconds: '',
  });

  const { hours, minutes, seconds } = time;

  function timeInputChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, name } = e.target;
    if (isNaN(+value)) return;
    const maxNumber = name === 'hours' ? '23' : '59';
    let newValue = value;

    if (value.length > 2) {
      newValue = value.substring(1);
    }

    if (+value < 9) {
      setTime((prev) => ({ ...prev, [name]: newValue.padStart(2, '0') }));
    } else if (+value > +maxNumber) {
      setTime((prev) => ({ ...prev, [name]: maxNumber }));
    } else {
      setTime((prev) => ({ ...prev, [name]: newValue }));
    }
  }

  function nameInputChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setNameValidity((prev) => ({ ...prev, touched: true }));
    const { value } = e.target;

    if (value.length < 2 || value.length > 15) {
      setNameValidity((prev) => ({ ...prev, valid: false }));
    } else {
      setNameValidity((prev) => ({ ...prev, valid: true }));
    }

    setName(value);
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
      setError('Something went wrong try to refresh');
      return;
    }

    const payload: Reminder = {
      name,
      timeStarted: new Date().getTime(),
      time: timeInSeconds,
    };

    if (description) payload.description = description;
    if (userId) payload.userId = userId;

    socket.emit(EVENTS.CLIENT.NEW_TIMER, payload);

    socket.on(EVENTS.SERVER.TIMER_CREATED, () => {
      setShowInfoModal(true);
      setName('');
      setTime({ hours: '', minutes: '', seconds: '' });
      setDescription('');
      setError('');
      setTimeout(() => setShowInfoModal(false), 3000);
    });
  }

  return (
    <form onSubmit={formSubmitHandler} className={classes.Form}>
      <p>{error}</p>
      <div className='input-container'>
        <input
          className={
            nameValidity.touched && !nameValidity.valid ? 'InValid' : ''
          }
          type='text'
          name='name'
          id='name'
          value={name}
          onChange={nameInputChangeHandler}
        />
        <label className={name.length ? 'Active' : ''} htmlFor='name'>
          title
        </label>
      </div>
      <fieldset>
        <div className='input-container'>
          <input
            onChange={timeInputChangeHandler}
            type='text'
            name='hours'
            id='hours'
            value={hours}
          />
          <label className={hours.length ? 'Active' : ''} htmlFor='hours'>
            hours
          </label>
        </div>
        <div className='input-container'>
          <input
            onChange={timeInputChangeHandler}
            type='text'
            name='minutes'
            id='minutes'
            value={minutes}
          />
          <label className={minutes.length ? 'Active' : ''} htmlFor='minutes'>
            minutes
          </label>
        </div>
        <div className='input-container'>
          <input
            onChange={timeInputChangeHandler}
            type='text'
            name='seconds'
            id='seconds'
            value={seconds}
          />
          <label className={seconds.length ? 'Active' : ''} htmlFor='seconds'>
            seconds
          </label>
        </div>
      </fieldset>
      <div className='input-container'>
        <textarea
          name='description'
          onChange={(e) => setDescription(e.target.value)}
          id='description'
          cols={30}
          rows={3}
          value={description}
        ></textarea>
        <label
          className={description.length ? 'Active' : ''}
          htmlFor='description'
        >
          description
        </label>
      </div>
      <motion.button
        whileHover={{
          scale: 1.1,
          backgroundColor: 'rgb(15, 196, 178)',
          borderColor: 'black',
          boxShadow: '5px 5px 12px black,-5px 5px 12px black',
        }}
        className={classes.Btn}
      >
        Start
      </motion.button>
    </form>
  );
};

export default TimerForm;
