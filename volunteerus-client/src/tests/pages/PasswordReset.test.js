import { render, screen } from "@testing-library/react";
import PasswordReset from "../../pages/PasswordReset";
import { BrowserRouter } from "react-router-dom";

describe('PasswordReset', () => {
    test('renders passwordReset', () => {
        render(
            <BrowserRouter>
                <PasswordReset />
            </BrowserRouter>
        )

        expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();
    });
});