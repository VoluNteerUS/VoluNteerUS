import React, { useEffect, useState } from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';

function TagInput({ onChildData, searchCallback, populateDataCallback, getTag, getData, buttonLabel }) {
    const [tags, setTags] = useState([]);
    const [data, setData] = useState([]); // [ {id: 1}, {id: 2}
    const [input, setInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const populateData = () => {
            const callBackData = populateDataCallback();
            setData(callBackData.map((item) => getData(item)));
            setTags(callBackData.map((item) => getTag(item)));
        }
        populateData();
    }, [getData, getTag, populateDataCallback]);


    const filterMembers = async (input) => {
        const filteredMembers = await searchCallback(input);
        setSearchResults(filteredMembers);
    }

    const handleAddTag = (item) => {
        const tag = getTag(item);
        if (tags.includes(tag)) {
            return;
        } else {
            const updatedTags = tags.concat(tag);
            setTags(updatedTags);
        }
    }

    const handleAddData = (item) => {
        const newData = getData(item);
        if (data.includes(newData)) {
            return;
        } else {
            const updatedData = data.concat(newData);
            setData(updatedData);
        }
    }

    const sendDataToParent = () => {
        onChildData(data);
    }

    return (
        <>
            <div className="bg-white border border-gray-300 rounded-t-lg p-4 h-24 overflow-y-scroll">
                <div className="flex flex-row gap-2">
                    <div className="flex flex-wrap">
                        {tags.map((tag, index) => (
                            <div
                                key={index}
                                className="bg-gray-200 text-gray-700 text-sm font-semibold px-2 py-1 mr-1 my-1 rounded-full"
                            >
                                {tag}
                                {/* Button to delete */}
                                <XCircleIcon
                                    className="w-4 h-4 inline-block ml-1 cursor-pointer"
                                    onClick={() => {
                                        setTags([...tags.filter((tag) => tag !== tags[index])]);
                                        setData([...data.filter((item) => item !== data[index])]);
                                    }}
                                />
                            </div>
                        ))}
                        <input
                            className={tags.length == 0 ? "w-screen text-gray-700 text-sm font-semibold px-2 mr-1 border-none outline-none" : "text-gray-700 text-sm font-semibold px-2 mr-1 border-none outline-none" }
                            value={input}
                            onChange={(event) => { 
                                setInput(event.target.value);
                                filterMembers(event.target.value)
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Backspace' && !input) {
                                    setTags(tags.slice(0, -1));
                                    setData(data.slice(0, -1));
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
            {/* Search Result */}
            <div className="bg-white border border-gray-300 rounded-b-lg h-50 overflow-y-scroll">
                <ul>
                    {
                        searchResults?.length > 0  && searchResults.map((item, index) => (
                            <li key={index} className="flex flex-row gap-2 py-2 px-4 hover:bg-slate-400">
                                <div className="flex items-center">
                                    { getTag(item) }
                                </div>
                                <button
                                    className= {
                                        tags.includes(getTag(item)) ? "bg-gray-300 text-gray-700 text-center font-semibold py-2 px-6 rounded-lg block ml-auto" :
                                        "bg-pink-500 hover:bg-pink-700 text-white text-center font-semibold py-2 px-6 rounded-lg block ml-auto"
                                    }
                                    onClick={
                                        () => { 
                                            handleAddTag(item);
                                            handleAddData(item);
                                            setInput('');
                                        }
                                    }
                                >
                                    { tags.includes(getTag(item)) ? "Added" : "Add" }
                                </button>
                            </li>
                        ))
                    }
                </ul>
            </div>
            {/* Save Button */}
            <div className="flex flex-row my-2">
                <button 
                  className="bg-pink-500 hover:bg-pink-700 text-white text-center font-semibold py-2 px-6 rounded-lg block ml-auto"
                  onClick={sendDataToParent}
                >
                  { buttonLabel }
                </button>
            </div>
        </>
    );
}

export default TagInput;