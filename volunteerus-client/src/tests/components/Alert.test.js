import { render, screen } from '@testing-library/react';
import Alert from '../../components/Alert';

describe('Alert', () => {
    test('renders alert', () => {
        render(
            <Alert message="This is an alert" type="success"/>
        );

        expect(screen.getByText(/This is an alert/i)).toBeInTheDocument();
    });
})