import { render, screen } from "@testing-library/react";
import PageNotFound from "../../pages/PageNotFound";
import { BrowserRouter } from "react-router-dom";

describe('PageNotFound', () => {
    test('renders pageNotFound', () => {
        render(
            <BrowserRouter>
                <PageNotFound />
            </BrowserRouter>
        )

        expect(screen.getByText(/404/i)).toBeInTheDocument();
    });
});