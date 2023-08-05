import { render } from "@testing-library/react";
import EditEventPart1 from "../../../components/form/EditEventPart1";
import { BrowserRouter } from "react-router-dom";

describe("EditEventPart1", () => {
    test("renders editEventPart1", () => {
        render(
            <BrowserRouter>
                <EditEventPart1 
                    details={[]}
                    setDetails={()=>{}}
                    error={""}
                    setError={()=>{}}
                    setPage={()=>{}}
                />
            </BrowserRouter>
        )
    });
});