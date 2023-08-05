import { render, screen } from "@testing-library/react";
import ForgotPassword from "../../pages/ForgotPassword";
import { BrowserRouter } from "react-router-dom";

describe('ForgotPassword', () => {
    test('renders forgotPassword', () => {
        render(
            <BrowserRouter>
                <ForgotPassword />
            </BrowserRouter>
        )
    });

    screen.debug()
});