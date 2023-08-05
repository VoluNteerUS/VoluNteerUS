import { render } from "@testing-library/react";
import EditEventPart5 from "../../../components/form/EditEventPart5";
import { BrowserRouter } from "react-router-dom";

describe("EditEventPart5", () => {
    test("renders editEventPart5", () => {
        render(
            <BrowserRouter>
                <EditEventPart5 
                    details={{
                        groupSettings: ["No", "-", 1],
                    }}
                    setFormQuestions={()=>{}}
                    error={""}
                    setError={()=>{}}
                    setPage={()=>{}}
                />
            </BrowserRouter>
        )
    });
});