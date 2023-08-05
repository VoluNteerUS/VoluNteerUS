import { render } from "@testing-library/react";
import EditEventPart2 from "../../../components/form/EditEventPart2";
import { BrowserRouter } from "react-router-dom";

describe("EditEventPart2", () => {
    test("renders editEventPart2", () => {
        render(
            <BrowserRouter>
                <EditEventPart2 
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