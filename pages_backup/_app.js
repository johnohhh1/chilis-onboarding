import '../src/index.css';
import '../src/App.css';
import { RestaurantProvider } from '../src/contexts/RestaurantContext';

function MyApp({ Component, pageProps }) {
  return (
    <RestaurantProvider>
      <Component {...pageProps} />
    </RestaurantProvider>
  );
}

export default MyApp; 