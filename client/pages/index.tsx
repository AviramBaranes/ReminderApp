import { GetServerSideProps } from 'next';

const index: React.FC = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return { redirect: { destination: '/timer', permanent: true } };
};

export default index;
