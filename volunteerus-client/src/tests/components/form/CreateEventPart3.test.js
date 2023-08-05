import { render } from "@testing-library/react";
import CreateEventPart3 from "../../../components/form/CreateEventPart3";
import { BrowserRouter } from "react-router-dom";

describe("CreateEventPart3", () => {
    test("renders createEventPart3", () => {
        render(
            <BrowserRouter>
                <CreateEventPart3 
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