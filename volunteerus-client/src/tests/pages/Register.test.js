import { fireEvent, render, screen } from '@testing-library/react';
import Register from '../../pages/Register';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../store';

describe('Register', () => {
    test('renders register', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Register />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByText(/Email/i)).toBeInTheDocument();
    });
});