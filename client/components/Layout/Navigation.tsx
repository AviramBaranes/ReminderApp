import { NextComponentType } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import logo from '../../public/logo.png';

const Navigation: React.FC = () => {
  return (
    <header>
      <nav>
        <div>
          <Image src={logo} width={25} height={25} />
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
