import Link from 'next/link';
import { useRouter } from 'next/router';

import classes from '../../styles/Layout/Navigation.module.scss';
import ClockLogoSvg from '../UI/Logo/ClockLogoSvg';

const Navigation: React.FC = () => {
  const { pathname } = useRouter();

  return (
    <header>
      <nav className={classes.Nav}>
        <div className={classes.Logo}>
          <ClockLogoSvg />
          <h6>Timers made easy</h6>
        </div>
        <ul>
          <li
            className={
              pathname === '/timer' ? classes.Active : classes.NotActive
            }
          >
            <Link href='/timer'>New Timer</Link>
          </li>
          <li
            className={
              pathname === '/list-timers' ? classes.Active : classes.NotActive
            }
          >
            <Link href='/list-timers'>All Timers</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;
