import { PrismicProvider } from '@prismicio/react';
import { AppProps } from 'next/app';
import Header from '../components/Header';
import { client } from '../services/prismic';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <PrismicProvider client={client}>
        <Header />
        <Component {...pageProps} />
      </PrismicProvider>
    </>
  );
}

export default MyApp;
