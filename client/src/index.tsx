import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import App from './app/App';
import { createStore } from './app/store/createStore';
import history from './app/utils/history';

const store = createStore();

function NavigationBridge() {
  const navigate = useNavigate();
  const location = useLocation();
  React.useLayoutEffect(() => history.bind(navigate, location), [navigate, location]);
  return null;
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <NavigationBridge />
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
