import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SignUpPart1 from "../../../components/form/SignUpPart1";
import event from "../../mocks/event.mock";

describe("SignUpPart1", () => {
    test("renders signUpPart1", () => {
        render(
            <BrowserRouter>
                <SignUpPart1 
                    response={{
                        selected_users: [{
                            _id: "64bd1f16b295ac86516820c7",
                            full_name: "John Doe",
                            email: "john.doe@u.nus.edu",
                        }],
                    }}
                    setResponse={()=>{}}
                    event={ event }
                    handleSubmit={()=>{}}
                    action={"Submit"}
                    setPage={()=>{}}
                />
            </BrowserRouter>
        )
    });
});