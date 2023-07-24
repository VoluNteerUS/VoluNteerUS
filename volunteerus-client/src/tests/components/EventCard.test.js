import { fireEvent, render, screen } from '@testing-library/react';
import EventCard from '../../components/EventCard';
import { event } from '../mocks/event.mock';
import { BrowserRouter } from 'react-router-dom';

describe('EventCard', () => {
    test('renders eventCard', () => {
        render(
            <BrowserRouter>
                <EventCard event={event} />
            </BrowserRouter>
        );

        expect(screen.getByText(/Test Event/i)).toBeInTheDocument();
    });
});