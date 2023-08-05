import { render } from "@testing-library/react";
import CreateEventPart2 from "../../../components/form/CreateEventPart2";
import { BrowserRouter } from "react-router-dom";

describe("CreateEventPart2", () => {
    test("renders createEventPart2", () => {
        render(
            <BrowserRouter>
                <CreateEventPart2 
                    details={{ 
                        title: 'Test Event',
                        date: ['2023-07-23', '2023-07-23', '14:00', '18:00'],
                    }}
                    setDetails={()=>{}}
                    error={""}
                    setError={()=>{}}
                    setPage={()=>{}}
                />
            </BrowserRouter>
        )
    });
});