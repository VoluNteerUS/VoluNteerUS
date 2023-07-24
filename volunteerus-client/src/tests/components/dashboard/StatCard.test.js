import { render, screen } from '@testing-library/react';
import StatCard from '../../../components/dashboard/StatCard';
import { BrowserRouter } from 'react-router-dom';

describe('StatCard', () => {
    test('renders statCard', () => {
        render(
            <BrowserRouter>
                <StatCard title={"Test Statistic"} value={10} route={"/test"} />
            </BrowserRouter>
        );

        expect(screen.getByText(/Test Statistic/i)).toBeInTheDocument();
        expect(screen.getByText(/10/i)).toBeInTheDocument();
    });
});