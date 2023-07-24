import { fireEvent, render, screen } from '@testing-library/react';
import Home from '../../pages/Home';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../store';

describe('Home', () => {
    test('renders home', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByText(/Join Us/i)).toBeInTheDocument();
    });
});