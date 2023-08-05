import { render } from "@testing-library/react";
import CreateEventPart1 from "../../../components/form/CreateEventPart1";
import { BrowserRouter } from "react-router-dom";

describe('CreateEventPart1', () => {
    test('renders createEventPart1', () => {
        render(
            <BrowserRouter>
                <CreateEventPart1 
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