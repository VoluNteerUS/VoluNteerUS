import { XMarkIcon, MinusCircleIcon, PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

function CreateEventPart4({ formQuestions, setFormQuestions, error, setError, setPage }) {
    const handleNext = (event) => {
        event.preventDefault();
        setError("");
        setPage(5);
    }

    const handleAddQuestion = () => {
        setError("");
        let length = Object.keys(formQuestions).length;
        if (length > 5) {
            setError("Maximum number of questions reached!")
        } else {
            let newQuestions = { ...formQuestions };
            newQuestions[`${length + 1}`] = [length + 1, "", "Open-ended", { "1": "" }];
            setFormQuestions({ ...newQuestions });
        }
    }

    const handleRemoveQuestion = (e, question) => {
        setError("");
        let newQuestions = { ...formQuestions };
        let length = Object.keys(formQuestions).length;
        let start = question[0] + 1;
        delete newQuestions[`${question[0]}`];
        while (start <= length) {
            // assign new key = old key - 1
            Object.defineProperty(newQuestions, `${start - 1}`, Object.getOwnPropertyDescriptor(newQuestions, `${start}`));
            delete newQuestions[`${start}`];
            newQuestions[`${start - 1}`][0] = start - 1;
            start = start + 1;
        }
        setFormQuestions({ ...newQuestions });
    }

    const handleQuestionChange = (e, question) => {
        setError("");
        let newQuestions = { ...formQuestions };
        newQuestions[`${question[0]}`][1] = `${e.target.value.slice(0, 1).toUpperCase()}` + `${e.target.value.slice(1)}`;
        setFormQuestions({ ...newQuestions });
    }

    const handleAddChoice = (e, question) => {
        setError("");
        let length = Object.keys(question[3]).length;
        let newQuestions = { ...formQuestions };
        newQuestions[`${question[0]}`][3][`${length + 1}`] = "";
        setFormQuestions({ ...newQuestions });
    }

    const handleRemoveChoice = (e, key, question) => {
        setError("");
        let newChoices = { ...question[3] };
        let length = Object.keys(question[3]).length;
        let start = Number(key) + 1;
        delete newChoices[key];
        while (start <= length) {
            // assign new key = old key - 1
            Object.defineProperty(newChoices, `${start - 1}`, Object.getOwnPropertyDescriptor(newChoices, `${start}`));
            delete newChoices[`${start}`];
            start = start + 1;
        }
        let newQuestions = { ...formQuestions };
        newQuestions[`${question[0]}`][3] = newChoices;
        setFormQuestions({ ...newQuestions });
    }

    const handleChoiceChange = (e, key, question) => {
        setError("");
        let newQuestions = { ...formQuestions };
        newQuestions[`${question[0]}`][3][key] = e.target.value
        setFormQuestions({ ...newQuestions });
    }

    const handleTypeChange = (e, question) => {
        setError("");
        let newQuestions = { ...formQuestions };
        newQuestions[`${question[0]}`][2] = e.target.value
        setFormQuestions({ ...newQuestions });
    }

    const handleBack = () => {
        setError("");
        setPage(3);
    }

    return (
        <div className="block mx-auto my-auto px-3 md:px-0 py-6 lg:py-12 md:w-3/4 lg:w-3/5 2xl:w-1/2">
            <div className="bg-white rounded-lg">
                <div className="flex flex-row justify-between">
                    <button onClick={handleBack} className="p-3 mt-3 mx-3">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <Link to="/" className="p-3 mt-3 mx-3 rounded-full bg-white/70 hover:bg-slate-500 self-end">
                        <XMarkIcon className="w-6 h-6 text-gray-700" />
                    </Link>
                </div>
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 sm:px-12 xl:py-2 mx-0 sm:mx-4 flex flex-col">
                        <h1 className="font-bold font-serif tracking-tight leading-none text-darkblue-900 text-xl md:text-2xl xl:text-3xl mb-6">Create sign up form for event</h1>
                        {/* form progress bar */}
                        <ol className="flex justify-center">
                            <li className="flex items-center w-1/6 after:content-[''] after:w-full after:h-1 after:border-b after:border-pink-400 after:border-4 after:inline-block">
                                <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-pink-400 rounded-full lg:h-12 lg:w-12 shrink-0">
                                    <p className="text-white">1</p>
                                </span>
                            </li>
                            <li className="flex items-center w-1/6 after:content-[''] after:w-full after:h-1 after:border-b after:border-pink-400 after:border-4 after:inline-block">
                                <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-pink-400 rounded-full lg:h-12 lg:w-12 shrink-0">
                                    <p className="text-white">2</p>
                                </span>
                            </li>
                            <li className="flex items-center w-1/6 after:content-[''] after:w-full after:h-1 after:border-b after:border-pink-400 after:border-4 after:inline-block">
                                <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-pink-400 rounded-full lg:h-12 lg:w-12 shrink-0">
                                    <p className="text-white">3</p>
                                </span>
                            </li>
                            <li className="flex items-center w-1/6 after:content-[''] after:w-full after:h-1 after:border-b after:border-grey-800 after:border-4 after:inline-block">
                                <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-pink-400 rounded-full lg:h-12 lg:w-12 shrink-0">
                                    <p className="text-white">4</p>
                                </span>
                            </li>
                            <li className="flex items-center">
                                <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-grey-800 rounded-full lg:h-12 lg:w-12 shrink-0">
                                    <p className="text-white">5</p>
                                </span>
                            </li>
                        </ol>
                        {/* Event sign up form questions */}
                        <h1 className="font-bold my-5">Sign Up Form Questions</h1>
                        <form onSubmit={handleNext} className="flex flex-col space-y-5">
                            {Object.values(formQuestions).map((question) => (
                                <>
                                    <div key={question[0]} className="flex space-x-3">
                                        <input type="text" value={question[1]} onChange={e => handleQuestionChange(e, question)} placeholder={`Question ${question[0]}`} className="border border-grey-600 p-1 rounded-lg w-2/3" />
                                        <select value={question[2]} onChange={e => handleTypeChange(e, question)} className="border border-grey-600 p-1 rounded-lg">
                                            <option value="Open-ended">Open-ended</option>
                                            <option value="MCQ">MCQ</option>
                                            <option value="MRQ">MRQ</option>
                                        </select>
                                        <button type="button" onClick={e => handleRemoveQuestion(e, question)} className="bg-red-700 text-white rounded-lg px-2">Remove</button>
                                    </div>
                                    <div>
                                        {question[2] !== "Open-ended"
                                            ?
                                            <div className="flex flex-col space-y-3">
                                                <div className="flex flex-wrap md:flex-row flex-col">
                                                    {Object.keys(question[3]).map((key) => (
                                                        <div className="flex space-x-3">
                                                            <input type="text" value={question[3][key]} onChange={e => handleChoiceChange(e, key, question)} placeholder="Enter a choice" className="border border-grey-600 p-1 rounded-lg ml-5" />
                                                            <button type="button" onClick={e => handleRemoveChoice(e, key, question)}><MinusCircleIcon width={30} height={30} className="text-red-700" /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <button type="button" onClick={e => handleAddChoice(e, question)}><PlusIcon width={30} height={30} className="text-grey-800" /></button>
                                            </div>
                                            : null}
                                    </div>
                                </>
                            ))}
                            <p className="text-red-700">{error}</p>
                            <div className="flex space-x-2 justify-end py-10">
                                <button type="button" onClick={handleAddQuestion} className="bg-grey-800 text-white rounded-lg px-2 py-1">Add Question</button>
                                <button type="submit" className="bg-pink-400 text-white rounded-lg px-3 py-1">Next</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateEventPart4;