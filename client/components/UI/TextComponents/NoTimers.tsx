import Link from 'next/link';

const NoTimers: React.FC = () => (
  <h4>
    You have no reminders, you can create one{' '}
    <Link href='/timer'>
      <span>here</span>
    </Link>
  </h4>
);

export default NoTimers;
