import { render, screen } from '@testing-library/react';
import ContentCard from '../../../components/dashboard/ContentCard';

describe('ContentCard', () => {
    const Child = () => {
        return (
            <div>
                <p>Test Child</p>
            </div>
        )
    }
    test('renders contentCard', () => {
        render(
            <ContentCard 
                title={"Test Event"} 
                children={<Child />} 
            />
        );

        expect(screen.getByText(/Test Event/i)).toBeInTheDocument();
        expect(screen.getByText(/Test Child/i)).toBeInTheDocument();
    });
});