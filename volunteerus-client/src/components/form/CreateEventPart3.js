import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function CreateEventPart3({ details, setDetails, error, setError, setPage }) {
    const [thumbnailImage, setThumbnailImage] = useState(null);

    const handleNext = (event) => {
        event.preventDefault();
        setError("")
        if (!details.file) {
            setError("Please select a thumbnail image for the event.");
        } else if (!details.file?.type.startsWith("image/")) {
            setError("Please select an image file.");
        } else if (details.file?.size > 5 * 1024 * 1024) {
            setError("Please select an image file smaller than 5MB.");
        } else {
            setPage(4);
        }
    }

    const handleBack = (event) => {
        event.preventDefault();
        setError("")
        setPage(2);
    }

    useEffect(() => {
        if (details.file) {
            setThumbnailImage(URL.createObjectURL(details.file));
        }
    }, [details.file]);

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
                    <div className="col-span-12 px-6 sm:px-12 xl:py-2 mx-0 sm:mx-4 flex flex-col">
                        <h1 className="font-bold font-serif tracking-tight leading-none text-darkblue-900 text-xl md:text-2xl xl:text-3xl mb-6">Create event</h1>
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
                            <li className="flex items-center w-1/6 after:content-[''] after:w-full after:h-1 after:border-b after:border-grey-800 after:border-4 after:inline-block">
                                <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-pink-400 rounded-full lg:h-12 lg:w-12 shrink-0">
                                    <p className="text-white">3</p>
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
                                    <label className="font-semibold">Event Title</label>
                                    <input type="text" value={details.title} placeholder="Event title" disabled className="p-1 border border-grey-600 rounded-md mb-2" onChange={e => { setDetails({ ...details, title: e.target.value }); }} />
                                </div>
                                <div className="flex flex-col justify-evenly">
                                    <label className="font-semibold">Thumbnail Image</label>
                                    {
                                        thumbnailImage !== null ? <img src={thumbnailImage} className="block mx-auto w-60 py-4" /> : ""
                                    }
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        files 
                                        className="p-1 border border-grey-600 rounded-md mb-2" 
                                        onChange={ 
                                            e => { 
                                                setDetails({ ...details, file: e.target.files[0] });
                                                setThumbnailImage(URL.createObjectURL(e.target.files[0]));
                                                setError(""); 
                                            }
                                        } 
                                    />
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

export default CreateEventPart3;