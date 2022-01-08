import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

import classes from '../../styles/Layout/Navigation.module.scss';
import ClockLogoSvg from '../UI/Logo/ClockLogoSvg';
import LogoText from './LogoText';

const Navigation: React.FC = () => {
  const { pathname } = useRouter();

  const navVariant = {
    hidden: {
      y: -100,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 110,
      },
    },
  };

  return (
    <header>
      <motion.nav
        variants={navVariant}
        animate='visible'
        initial='hidden'
        className={classes.Nav}
      >
        <div id='logo' className={classes.Logo}>
          <ClockLogoSvg />
          <LogoText />
        </div>
        <ul id='navigation-list'>
          <li
            className={
              pathname === '/timer' ? classes.Active : classes.NotActive
            }
          >
            <Link href='/timer'>New Reminder</Link>
          </li>
          <li
            className={
              pathname === '/list-timers' ? classes.Active : classes.NotActive
            }
          >
            <Link href='/list-timers'>All Reminders</Link>
          </li>
        </ul>
      </motion.nav>
    </header>
  );
};

export default Navigation;
