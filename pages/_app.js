import '../src/index.css';
import '../src/App.css';
import { SessionProvider } from 'next-auth/react';
import { RestaurantProvider } from '../src/contexts/RestaurantContext';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <RestaurantProvider>
        <Component {...pageProps} />
      </RestaurantProvider>
    </SessionProvider>
  );
}

export default MyApp; 