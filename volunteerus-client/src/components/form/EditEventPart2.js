import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import moment from "moment";

function EditEventPart2({ details, setDetails, error, setError, setPage }) {

    const handleNext = (event) => {
        event.preventDefault();
        setError("")
        // validate form
        if (!details.title.replace(/\s/g, '').length) {
            setError("Please enter a title for the event.");
        } else if (!details.category.length) {
            setError("Please select at least one category for the event.");
        } else if (details.date.filter((date) => date !== "").length !== 4) {
            setError("Please complete the start/end date/time for the event.");
        } else if (!details.signup_by.length) {
            setError("Please enter a closing date for the sign up.");
        } else if (new Date(details.date[0]).getTime() > new Date(details.date[1]).getTime()) {
            setError("Start date cannot be later than End date.");
        } else if (moment(`${ details.signup_by }`).isAfter(moment(`${ details.date[1] }`))) {
            setError("Form closing date cannot be later than event end date.");
        } else {
            setPage(3);
        }
    }

    const handleBack = (event) => {
        event.preventDefault();
        setError("")
        setPage(1);
    }

    return (
        // Make it appear behind the navbar but in front of the background and top of the page
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
                    <div className="col-span-12 px-6 sm:px-12 xl:py-2 mx-0 sm:mx-4 flex flex-col">
                        <h1 className="font-bold font-serif tracking-tight leading-none text-darkblue-900 text-xl md:text-2xl xl:text-3xl mb-6">Edit event</h1>
                        {/* form progress bar */}
                        <ol className="flex justify-center">
                            <li className="flex items-center w-1/6 after:content-[''] after:w-full after:h-1 after:border-b after:border-pink-400 after:border-4 after:inline-block">
                                <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-pink-400 rounded-full lg:h-12 lg:w-12 shrink-0">
                                    <p className="text-white text-sm sm:text-base">1</p>
                                </span>
                            </li>
                            <li className="flex items-center w-1/6 after:content-[''] after:w-full after:h-1 after:border-b after:border-grey-800 after:border-4 after:inline-block">
                                <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-pink-400 rounded-full lg:h-12 lg:w-12 shrink-0">
                                    <p className="text-white text-sm sm:text-base">2</p>
                                </span>
                            </li>
                            <li className="flex items-center w-1/6 after:content-[''] after:w-full after:h-1 after:border-b after:border-grey-800 after:border-4 after:inline-block">
                                <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-grey-800 rounded-full lg:h-12 lg:w-12 shrink-0">
                                    <p className="text-white text-sm sm:text-base">3</p>
                                </span>
                            </li>
                            <li className="flex items-center w-1/6 after:content-[''] after:w-full after:h-1 after:border-b after:border-grey-800 after:border-4 after:inline-block">
                                <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-grey-800 rounded-full lg:h-12 lg:w-12 shrink-0">
                                    <p className="text-white">4</p>
                                </span>
                            </li>
                            <li className="flex items-center">
                                <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-grey-800 rounded-full lg:h-12 lg:w-12 shrink-0">
                                    <p className="text-white">5</p>
                                </span>
                            </li>
                        </ol>
                        {/* Create event details form questions */}
                        <form onSubmit={handleNext} className="flex flex-col my-5 space-y-5">
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col justify-evenly">
                                    <label className="font-semibold">Event title</label>
                                    <input type="text" value={details.title} placeholder="Event title" disabled className="p-1 border border-grey-600 rounded-md mb-2" onChange={e => { setDetails({ ...details, title: e.target.value }); }} />
                                </div>
                                <div className="flex flex-col justify-evenly">
                                    <label className="font-semibold">Category (select all that applies)</label>
                                    <select multiple={true} value={details.category} className="p-1 border border-grey-600 rounded-md mb-2" onChange={e => {
                                        const options = [...e.target.selectedOptions];
                                        const values = options.map(option => option.value);
                                        setDetails({ ...details, category: values });
                                    }}
                                    >
                                        <option value="Elderly">Elderly</option>
                                        <option value="Migrant Workers">Migrant Workers</option>
                                        <option value="Patients">Patients</option>
                                        <option value="PWID">PWID</option>
                                        <option value="Youth">Youth</option>
                                        <option value="Local">Local</option>
                                        <option value="Overseas">Overseas</option>
                                        <option value="Special project">Special project</option>
                                        <option value="Regular project">Regular project</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-12 gap-3">
                                    <div className="col-span-12 sm:col-span-6 lg:col-span-3 flex flex-col">
                                        <label className="font-semibold">Start date</label>
                                        <input type="date" value={details.date[0]} className="p-1 border border-grey-600 rounded-md mb-2" onChange={e => { setDetails({ ...details, date: [e.target.value, details.date[1], details.date[2], details.date[3]] }); }} />
                                    </div>
                                    <div className="col-span-12 sm:col-span-6 lg:col-span-3 flex flex-col">
                                        <label className="font-semibold">Start time</label>
                                        <input type="time" value={details.date[2]} className="p-1 border border-grey-600 rounded-md mb-2" onChange={e => { setDetails({ ...details, date: [details.date[0], details.date[1], e.target.value, details.date[3]] }); }} />
                                    </div>
                                    <div className="col-span-12 sm:col-span-6 lg:col-span-3 flex flex-col">
                                        <label className="font-semibold">End date</label>
                                        <input type="date" value={details.date[1]} className="p-1 border border-grey-600 rounded-md mb-2" onChange={e => { setDetails({ ...details, date: [details.date[0], e.target.value, details.date[2], details.date[3]] }); }} />
                                    </div>
                                    <div className="col-span-12 sm:col-span-6 lg:col-span-3 flex flex-col">
                                        <label className="font-semibold">End time</label>
                                        <input type="time" value={details.date[3]} className="p-1 border border-grey-600 rounded-md mb-2" onChange={e => { setDetails({ ...details, date: [details.date[0], details.date[1], details.date[2], e.target.value] }); }} />
                                    </div>
                                </div>
                                <div className="flex flex-col justify-evenly">
                                    <label className="font-semibold">Form closing date</label>
                                    <input type="date" value={moment(`${details.signup_by}`).format('yyyy-MM-DD')} className="p-1 border border-grey-600 rounded-md mb-2" onChange={e => { setDetails({ ...details, signup_by: e.target.value }); }} />
                                </div>
                            </div>
                            {
                                error !== "" ? <p className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded relative" role="alert">{error}</p> : ""
                            }
                            <button type="submit" className="bg-pink-400 text-white font-semibold rounded-lg px-6 py-2 self-end">
                                Next
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div> 
    )
}

export default EditEventPart2;