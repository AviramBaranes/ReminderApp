import type { AppProps } from 'next/app';

import '../styles/globals.scss';
import Layout from '../components/Layout/Layout';
import { Provider } from 'react-redux';
import store from '../redux/store/store';
import ErrorContainer from '../components/UI/Modals/ErrorContainer';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Layout>
        <ErrorContainer />
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
