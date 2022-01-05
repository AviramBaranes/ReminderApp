import Link from 'next/link';

import ClockLogoSvg from '../UI/Logo/ClockLogoSvg';

const Navigation: React.FC = () => {
  return (
    <header>
      <nav>
        <div>
          <ClockLogoSvg />
          <h6>Timers made easy</h6>
        </div>
        <ul>
          <li>
            <Link href='/timer'>new timer</Link>
          </li>
          <li>
            <Link href='/list-timers'>all timers</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;
