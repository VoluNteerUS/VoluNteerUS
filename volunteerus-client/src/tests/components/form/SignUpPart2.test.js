import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SignUpPart2 from "../../../components/form/SignUpPart2";
import event from "../../mocks/event.mock";
import response from "../../mocks/response.mock";

describe("SignUpPart2", () => {
    test("renders signUpPart2", () => {
        render(
            <BrowserRouter>
                <SignUpPart2 
                    questions={[]}
                    response={response}
                    event={ event }
                    setResponse={()=>{}}
                    handleSubmit={()=>{}}
                    handleChange={()=>{}}
                    action={"Submit"}
                    setPage={()=>{}}
                />
            </BrowserRouter>
        )
    });
});