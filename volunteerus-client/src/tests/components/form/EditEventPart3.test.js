import { render } from "@testing-library/react";
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