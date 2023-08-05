import { render } from "@testing-library/react";
import EditEventPart4 from "../../../components/form/EditEventPart4";
import { BrowserRouter } from "react-router-dom";

describe("EditEventPart4", () => {
    test("renders editEventPart4", () => {
        render(
            <BrowserRouter>
                <EditEventPart4 
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