import { Provider } from 'react-redux';
import Home from '@/page/home';
import { store } from '@/redux/store.ts';

export default function App() {
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
}
