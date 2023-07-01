import React from "react";
import { render, screen } from "@testing-library/react";

import Home from "./Home";

describe("Home", () => {
    it("renders Home component", () => {
        render(<Home />);
        expect(screen.getByText("Join Us!")).toBeInTheDocument();
    });
});