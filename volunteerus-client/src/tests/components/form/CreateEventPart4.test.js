import { render } from "@testing-library/react";
import CreateEventPart4 from "../../../components/form/CreateEventPart4";
import { BrowserRouter } from "react-router-dom";

describe("CreateEventPart4", () => {
    test("renders createEventPart4", () => {
        render(
            <BrowserRouter>
                <CreateEventPart4 
                    formQuestions={[]}
                    setFormQuestions={()=>{}}
                    error={""}
                    setError={()=>{}}
                    setPage={()=>{}}
                />
            </BrowserRouter>
        )
    });
});