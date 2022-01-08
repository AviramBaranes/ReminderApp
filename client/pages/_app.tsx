import type { AppProps } from 'next/app';
import { AnimatePresence } from 'framer-motion';

import '../styles/globals.scss';
import Layout from '../components/Layout/Layout';
import { Provider } from 'react-redux';
import store from '../redux/store/store';
import ErrorContainer from '../components/UI/Info/ErrorContainer';

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <Provider store={store}>
      <Layout>
        <ErrorContainer />
        <AnimatePresence exitBeforeEnter>
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </Layout>
    </Provider>
  );
}

export default MyApp;
