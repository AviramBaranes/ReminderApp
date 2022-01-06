import Link from 'next/link';

import classes from '../../../styles/pages/TimersList.module.scss';

const NoTimers: React.FC = () => (
  <p className={classes.NoTimers}>
    You have no reminders, you can create one{' '}
    <Link href='/timer'>
      <span>here</span>
    </Link>
  </p>
);

export default NoTimers;
