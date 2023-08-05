import { render } from "@testing-library/react";
import TagInput from "../../components/TagInput";

describe("TagInput", () => {
    test("renders tagInput", () => {
        render(
            <TagInput
                onChildData = {()=>{}}
                searchCallback = {()=>{}}
                populateDataCallback = {() => [
                    {
                        "id": 1,
                        "name": "Animals"
                    },
                    {
                        "id": 2,
                        "name": "Children"
                    }
                ]}
                getTag = {(item)=> item.name}
                getData = {(item)=> item.id}
                buttonLabel = {"Save"}
            />
        )

        expect(document.querySelector("input")).toBeInTheDocument();
    });
});