import { fireEvent, render, screen } from '@testing-library/react';
import Login from '../../pages/Login';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../store';

describe('Login', () => {
    test('renders login', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByText(/Email/i)).toBeInTheDocument();
    });
});