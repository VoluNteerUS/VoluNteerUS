import { render, screen } from '@testing-library/react';
import ProfileDropdown from '../../../components/navigation/ProfileDropdown';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react'
import { store, persistor } from '../../../store';

describe('ProfileDropdown', () => {
    test('renders profileDropdown', () => {
        render(
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <BrowserRouter>
                        <ProfileDropdown isAuthenticated={false} />
                    </BrowserRouter>
                </PersistGate>
            </Provider>
        );
    });
});