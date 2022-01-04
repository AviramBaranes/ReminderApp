import { GetStaticProps, NextComponentType } from 'next';

const index: React.FC = () => {
  return null;
};

export const getStaticProps: GetStaticProps = () => {
  return { redirect: { destination: '/timer', permanent: true } };
};

export default index;
