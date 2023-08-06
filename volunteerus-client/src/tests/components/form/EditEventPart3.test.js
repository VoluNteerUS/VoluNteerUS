import { render, screen, fireEvent } from "@testing-library/react";
import EditEventPart3 from "../../../components/form/EditEventPart3";
import { BrowserRouter } from "react-router-dom";

describe("EditEventPart3", () => {
    test("renders editEventPart3", () => {
        render(
            <BrowserRouter>
                <EditEventPart3 
                    details={{ 
                        title: 'Test Event',
                        date: ['2023-07-23', '2023-07-23', '14:00', '18:00'],
                        image_url: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
                        file: null,
                    }}
                    setDetails={()=>{}}
                    error={""}
                    setError={()=>{}}
                    setPage={()=>{}}
                />
            </BrowserRouter>
        )

        expect(screen.getByText("Edit event")).toBeInTheDocument();
    });

    test("click on next button", () => {
        render(
            <BrowserRouter>
                <EditEventPart3 
                    details={{ 
                        title: 'Test Event',
                        date: ['2023-07-23', '2023-07-23', '14:00', '18:00'],
                        image_url: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
                        file: null,
                    }}
                    setDetails={()=>{}}
                    error={""}
                    setError={()=>{}}
                    setPage={()=>{}}
                />
            </BrowserRouter>
        )
        
        fireEvent.click(
            screen.getByText("Next"),
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
            }),
        );

        expect(screen.getByText("Edit event")).toBeInTheDocument();
    });
});