import { render } from "@testing-library/react";
import CreateEventPart5 from "../../../components/form/CreateEventPart5";
import { BrowserRouter } from "react-router-dom";

describe("CreateEventPart5", () => {
    test("renders createEventPart5", () => {
        render(
            <BrowserRouter>
                <CreateEventPart5 
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