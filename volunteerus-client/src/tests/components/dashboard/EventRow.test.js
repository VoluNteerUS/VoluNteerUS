import { render, screen } from '@testing-library/react';
import EventRow from '../../../components/dashboard/EventRow';
import { event } from '../../mocks/event.mock';

describe('EventRow', () => {
    test('renders eventRow', () => {
        render(
            <EventRow event={event} />
        );

        expect(screen.getByText(/Test Event/i)).toBeInTheDocument();
    });
});