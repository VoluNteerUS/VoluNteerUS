import { useState, Fragment } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import imageUploadPlaceholder from "../../assets/images/image-upload-placeholder.png";
import { setUser } from "../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const facultiesAndSchools = [
    "Select your faculty or school",
    "College of Design and Engineering",
    "College of Humanities and Sciences",
    "Faculty of Arts and Social Sciences",
    "Faculty of Dentistry",
    "Faculty of Law",
    "Faculty of Science",
    "School of Business",
    "School of Computing",
    "School of Continuing and Lifelong Education",
    "Yong Siew Toh Conservatory of Music",
    "Yong Loo Lin School of Medicine",
]

function BasicProfileSetUp() {
    const persistedUserState = useSelector((state) => state.user);
    const user = persistedUserState?.user || {};
    const [fullName, setFullName] = useState(user.full_name || "");
    const [email, setEmail] = useState(user.email || "");
    const [selectedFaculty, setSelectedFaculty] = useState(facultiesAndSchools[0]);
    const [major, setMajor] = useState("");
    const [yearOfStudy, setYearOfStudy] = useState(1);
    const [dietaryRestrictions, setDietaryRestrictions] = useState("");
    const [telegramHandle, setTelegramHandle] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    // const [skills, setSkills] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleProfilePictureChange = (event) => {
        event.preventDefault();

        if (!event.target.files) {
            return;
        }

        if (!event.target.files[0]) {
            return;
        }

        const file = event.target.files[0];
        // Check if file is an image
        if (!file.type.startsWith("image/")) {
            setErrorMessage("Please upload an image file.");
            return;
        } else if (file.size > 5 * 1024 * 1024) {
            setErrorMessage("Please upload an image file smaller than 5MB.");
            return;
        } else {
            setProfilePicture(file);
        }
    }

    const handleSaveProfile = (event) => {
        event.preventDefault();
        // Clear error message
        setErrorMessage("");
        // Validation
        if (selectedFaculty === facultiesAndSchools[0]) {
            setErrorMessage("Please select your faculty or school.");
            return;
        } else if (major === "") {
            setErrorMessage("Please enter your major.");
            return;
        }

        const formData = new FormData();
        formData.append("file", profilePicture);
        formData.append("full_name", fullName);
        formData.append("email", email);
        formData.append("phone_number", phoneNumber);
        formData.append("faculty", selectedFaculty);
        formData.append("major", major);
        formData.append("year_of_study", yearOfStudy);
        formData.append("telegram_handle", telegramHandle);
        formData.append("dietary_restrictions", dietaryRestrictions);

        const userURL = new URL(`/users/${user.id}`, process.env.REACT_APP_BACKEND_API);
        axios.patch(userURL, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        }).then((response) => {
            //  Get the updated user object from the response
            axios.get(userURL).then((res) => {
                let user = res.data;
                dispatch(setUser({
                    email: user.email,
                    full_name: user.full_name,
                    id: user._id,
                    role: user.role,
                    registered_on: user.registered_on,
                    profile_picture: user.profile_picture,
                    phone_number: user.phone_number,
                    telegram_handle: user.telegram_handle,
                    faculty: user.faculty,
                    major: user.major,
                    year_of_study: user.year_of_study,
                    dietary_restrictions: user.dietary_restrictions,
                }));
                navigate("/dashboard");
            }).catch((error) => {
                setErrorMessage("Profile update failed!");
            });
        }).catch((error) => {
            setErrorMessage("Profile update failed!");
        });        
    }

    if (localStorage.getItem("token")) {
        return (
            <div className="bg-pink-100 min-h-screen">
                <div className="block mx-auto lg:w-2/3 py-16">
                    <div className="bg-neutral-100 rounded-lg p-8">
                        <div className="flex flex-col">
                            <h1 className="text-3xl text-darkblue-900 font-semibold font-serif">Set up your basic profile</h1>
                            <p>Add basic information about yourself. This helps organizations to know you better!</p>
                        </div>
                        {/* Form */}
                        <div className="grid grid-cols-12 mt-6 gap-3">
                            {/* Profile Picture */}
                            <div className="flex flex-col col-span-12">
                                <div className="block mx-auto">
                                    <label htmlFor="profile-picture" className="block text-base font-medium text-neutral-600">
                                        <img src={profilePicture ? URL.createObjectURL(profilePicture) : imageUploadPlaceholder} alt="Profile" className="w-40 h-40 rounded-full object-cover hover:border-gray-500 hover:border-2" />
                                    </label>
                                    <input type="file" id="profile-picture" accept="image/*" className="hidden" onChange={handleProfilePictureChange} />
                                </div>
                            </div>
                            <div className="flex flex-col col-span-4">
                                <label className="block text-base font-medium text-neutral-600">Faculty</label>
                                <Listbox value={selectedFaculty} onChange={setSelectedFaculty}>
                                    <div className="relative mt-1">
                                        <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                                            <span className="block truncate">{selectedFaculty}</span>
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                <ChevronDownIcon className="w-5 h-5 text-neutral-400" aria-hidden="true" />
                                            </span>
                                        </Listbox.Button>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {facultiesAndSchools.map((faculty, index) => (
                                                    <Listbox.Option
                                                        key={index}
                                                        className={({ active }) =>
                                                            `${active ? 'text-primary-900 bg-primary-100' : 'text-neutral-900'}
                                                            cursor-default select-none relative py-2 pl-10 pr-4`
                                                        }
                                                        value={faculty}
                                                    >
                                                        {({ selected, active }) => (
                                                            <>
                                                                <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                                                                    {faculty}
                                                                </span>
                                                                {selected ? (
                                                                    <span
                                                                        className={`${active ? 'text-primary-600' : 'text-primary-600'}
                                                                        absolute inset-y-0 left-0 flex items-center pl-3`}
                                                                    >
                                                                        <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>
                            <div className="flex flex-col col-span-6">
                                <label className="block text-base font-medium text-neutral-600">Major</label>
                                <input type="text" className="px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm sm:text-sm" value={major} onChange={e => setMajor(e.target.value)} />
                            </div>
                            <div className="flex flex-col col-span-2">
                                <label className="block text-base font-medium text-neutral-600">Year of Study</label>
                                <input type="number" min={1} max={5} className="px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm sm:text-sm" value={yearOfStudy} onChange={e => setYearOfStudy(e.target.value)}/>
                            </div>
                            <div className="flex flex-col col-span-6">
                                <label className="block text-base font-medium text-neutral-600">Phone Number</label>
                                <input type="text" className="px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm sm:text-sm" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                            </div>
                            <div className="flex flex-col col-span-6">
                                <label className="block text-base font-medium text-neutral-600">Telegram Handle</label>
                                <input type="text" className="px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm sm:text-sm" value={telegramHandle} onChange={e => setTelegramHandle(e.target.value)} />
                            </div>
                            <div className="flex flex-col col-span-12">
                                <label className="block text-base font-medium text-neutral-600">Dietary Restrictions</label>
                                <input type="text" className="px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm sm:text-sm" value={dietaryRestrictions} onChange={e => setDietaryRestrictions(e.target.value)}/>
                            </div>
                            {/* <div className="flex flex-col col-span-12">
                                <label className="block text-base font-medium text-neutral-600">Skills</label>
                                <textarea rows={4} className="px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm sm:text-sm" value={skills} onChange={e => setSkills(e.target.value)} />
                            </div> */}
                        </div>
                        {/* Error Message */}
                        {   errorMessage && (
                            <div className="bg-red-200 mt-3 p-3 rounded-md">
                                <p className="text-sm text-red-600">{errorMessage}</p>
                            </div>
                        )}
                        {/* Buttons */}
                        <div className="flex justify-end mt-6">
                            <button 
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                onClick={handleSaveProfile}
                            >
                                Save Profile
                            </button>
                        </div>                                           
                    </div>
                </div>
            </div>
        );
    } else {
        return <Navigate to="/login" replace={true} />
    }
}

export default BasicProfileSetUp