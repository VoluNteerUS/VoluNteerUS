import { render, screen } from '@testing-library/react';
import App from '../App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react'
import { store, persistor } from '../store';

describe('App', () => {
  test('renders app', () => {
    render(
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    );

    // App is empty because it is a wrapper for the routes
  });
});