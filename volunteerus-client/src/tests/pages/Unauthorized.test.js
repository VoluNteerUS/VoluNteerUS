import { render, screen } from "@testing-library/react";
import Unauthorized from "../../pages/Unauthorized";
import { BrowserRouter } from "react-router-dom";

describe('Unauthorized', () => {
    test('renders unauthorized', () => {
        render(
            <BrowserRouter>
                <Unauthorized />
            </BrowserRouter>
        )

        expect(screen.getByText(/403/i)).toBeInTheDocument();
    });
});