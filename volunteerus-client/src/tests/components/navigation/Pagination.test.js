import { render, screen } from '@testing-library/react';
import Pagination from '../../../components/navigation/Pagination';
import { BrowserRouter } from 'react-router-dom';

describe('Pagination', () => {
    test('renders pagination', () => {
        render(
            <BrowserRouter>
                <Pagination 
                    currentPage={1}
                    limit={10}
                    totalItems={20}
                    totalPages={2}
                    handlePageChange={() => {}}
                    handleNextPage={() => {}}
                    handlePrevPage={() => {}}
                />
            </BrowserRouter>
        );

        expect(screen.getByText(/results/i)).toBeInTheDocument();
    });
});