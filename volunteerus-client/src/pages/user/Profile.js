import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import Navbar from "../../components/navigation/Navbar"
import { ChevronDownIcon, CheckIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import AuthProtected from "../../common/protection/AuthProtected";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../actions/userActions";
import Alert from "../../components/Alert";
import { Listbox, Transition } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";

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

function UserProfile() {
    const persistedUserState = useSelector((state) => state.user);
    const user = persistedUserState?.user || 'Unknown';
    const [profilePicture, setProfilePicture] = useState(user?.profile_picture || `https://ui-avatars.com/api/?name=${user.full_name ?? ''}&background=FF71A3&color=fff`);
    const [file, setFile] = useState(null);
    const [fullName, setFullName] = useState(user?.full_name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '');
    const [faculty, setFaculty] = useState(user?.faculty || facultiesAndSchools[0]);
    const [major, setMajor] = useState(user?.major || '');
    const [yearOfStudy, setYearOfStudy] = useState(user?.year_of_study || 1);
    const [telegramHandle, setTelegramHandle] = useState(user?.telegram_handle || '');
    const [dietaryRestrictions, setDietaryRestrictions] = useState(user?.dietary_restrictions || '');
    const [skills, setSkills] = useState(user?.skills || []);
    const [formSkills, setFormSkills] = useState(user?.skills || []);
    const [skillsInput, setSkillsInput] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [alertMessages, setAlertMessages] = useState([]);
    const [errorMessages, setErrorMessages] = useState([]);

    const dispatch = useDispatch();

    const handleDialogOpen = () => {
        setDialogOpen(true);
    }

    const handleDialogClose = () => {
        setDialogOpen(false);
        setFile(null);
    }

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
            alert("File is not an image.");
            return;
        } else if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5MB.");
            return;
        } else {
            setProfilePicture(URL.createObjectURL(file));
            setFile(file);
        }
    }

    const handleClearProfilePicture = (event) => {
        event.preventDefault();
        setProfilePicture(`https://ui-avatars.com/api/?name=${user.full_name ?? ''}&background=FF71A3&color=fff`);
        setFile(null);
    }


    const handleSaveProfile = (event) => {
        // Clear alert and error messages
        setAlertMessages([]);
        setErrorMessages([]);

        // Validate form
        if (fullName === '') {
            setErrorMessages([{
                type: "error",
                message: "Name cannot be empty."
            }]);
            return;
        } else if (faculty === facultiesAndSchools[0]) {
            setErrorMessages([{
                type: "error",
                message: "Please select your faculty or school."
            }]);
            return;
        } else if (major === '') {
            setErrorMessages([{
                type: "error",
                message: "Major cannot be empty."
            }]);
            return;
        }

        event.preventDefault();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("full_name", fullName);
        formData.append("email", email);
        formData.append("phone_number", phoneNumber);
        formData.append("faculty", faculty);
        formData.append("major", major);
        formData.append("year_of_study", yearOfStudy);
        formData.append("telegram_handle", telegramHandle);
        formData.append("dietary_restrictions", dietaryRestrictions);
        formData.append("skills", JSON.stringify(formSkills));

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
                    skills: user.skills,
                }));
                setAlertMessages([
                    {
                        type: "success",
                        message: "Profile updated successfully!"
                    }
                ]);
            }).catch((error) => {
                setAlertMessages([
                    {
                        type: "error",
                        message: "Profile update failed!"
                    }
                ]);
            });
        }).catch((error) => {
            setAlertMessages([
                {
                    type: "error",
                    message: "Profile update failed!"
                }
            ]);
        });

        handleDialogClose();
    }

    return (
        <AuthProtected>
            <Navbar />
            <div className="block mx-auto px-4 lg:w-3/4 lg:px-0">
                <div className="h-4"></div>
                {/* Breadcrumbs */}
                <div className="flex items-center text-base py-2 px-3 md:px-0">
                    <Link to={localStorage.getItem("token") ? "/dashboard" : "/"} className="text-sky-600 hover:text-sky-700 transition duration-150 ease-in-out">Home</Link>
                    <span className="mx-2">/</span>
                    <Link to="/profile" className="text-neutral-600 transition duration-150 ease-in-out">Profile</Link>
                </div>
                <div className="h-6"></div>
                {/* Alert */}
                {
                    alertMessages.length > 0 && alertMessages.map((alertMessage, index) => (
                        <Alert key={index} type={alertMessage.type} message={alertMessage.message} />
                    ))
                }
                {/* Page Title */}
                <h1 className="text-3xl font-bold pb-4 px-3 md:px-0">Profile</h1>
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 px-3 md:col-span-4 md:px-0">
                        <div className="bg-neutral-100 rounded shadow p-5">
                            <div className="flex flex-col items-center">
                                <img
                                    className="h-20 w-20 rounded-full"
                                    src={user.profile_picture || `https://ui-avatars.com/api/?name=${user.full_name ?? ''}&background=FF71A3&color=fff`}
                                    alt="Profile Picture"
                                />
                                <h2 className="text-2xl font-semibold py-2">{user.full_name}</h2>
                            </div>
                            <div className="flex flex-col items-start">
                                <div className="flex items-center py-2">
                                    <EnvelopeIcon className="h-5 w-5 text-neutral-600" />
                                    <span className="ml-2 text-neutral-600">{user.email}</span>
                                </div>
                                <div className="flex items-center py-2">
                                    <PhoneIcon className="h-5 w-5 text-neutral-600" />
                                    <span className="ml-2 text-neutral-600">{user.phone_number || "Not Specified"}</span>
                                </div>
                            </div>
                            {/* Skills */}
                            <div className="py-3">
                                <label className="block text-base font-medium text-neutral-600">Skills</label>
                                <div className="flex flex-wrap gap-2">
                                    {
                                        skills.length > 0 ? skills.map((skill, index) => (
                                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                                {skill}
                                            </span>
                                        )) : <span className="text-neutral-600">Not Specified</span>
                                    }
                                </div>
                            </div>
                            <Link onClick={handleDialogOpen} className="block mx-auto bg-primary-600 text-white text-center hover:bg-primary-500 px-8 py-2 font-medium rounded-md transition duration-150 ease-in-out">Edit Profile</Link>
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-8 px-3 md:px-0">
                        <div className="bg-neutral-100 rounded shadow p-5">
                            <h2 className="font-semibold text-2xl">Personal Information</h2>
                            {/* NUSNET */}
                            <div className="py-3">
                                <label className="block text-base font-medium text-neutral-600">NUS Email</label>
                                <span className="text-neutral-600">{user.email}</span>
                            </div>
                            {/* Faculty Major */}
                            <div className="py-3">
                                <label className="block text-base font-medium text-neutral-600">Faculty / Major</label>
                                <span className="text-neutral-600">{user.faculty === '' ? 'Not Specified' : user.faculty} / {user.major === '' ? 'Not Specified' : user.major}</span>
                            </div>
                            {/* Year of Study */}
                            <div className="py-3">
                                <label className="block text-base font-medium text-neutral-600">Year of Study</label>
                                <span className="text-neutral-600">{user.year_of_study}</span>
                            </div>
                            {/* Telegram Handle */}
                            <div className="py-2">
                                <label className="block text-base font-medium text-neutral-600">Telegram Handle</label>
                                <span className="text-neutral-600">{user.telegram_handle === '' ? 'Not Specified' : user.telegram_handle}</span>
                            </div>
                            {/* Dietary Preferences */}
                            <div className="py-2">
                                <label className="block text-base font-medium text-neutral-600">Dietary Restrictions</label>
                                <span className="text-neutral-600">{user.diet ?? 'Not Applicable'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Edit Profile */}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                {/* Overlay */}
                {dialogOpen && (
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                )}
                {/* Panel */}
                <div className="fixed inset-0 flex items-center justify-center">
                    <Dialog.Panel className="bg-white rounded-lg w-full mx-4 md:mx-0 md:w-2/3 lg:w-1/2 p-8 h-4/5 md:h-3/4 overflow-y-auto">
                        <Dialog.Title className="text-2xl font-semibold">Edit Profile</Dialog.Title>
                        {/* Error Messages */}
                        {
                            errorMessages.length > 0 && errorMessages.map((errorMessage, index) => (
                                <Alert key={index} type={errorMessage.type} message={errorMessage.message} />
                            ))
                        }
                        {/* Profile Picture */}
                        <form onSubmit={handleSaveProfile}>
                        <div className="flex flex-col py-3">
                            <div className="block mx-auto">
                                <img
                                    className="h-28 w-28 rounded-full"
                                    src={profilePicture}
                                    alt="Profile Picture"
                                />
                            </div>
                            <div className="py-4 flex flex-row justify-center gap-4">
                                <label
                                    htmlFor="profile-picture"
                                    className="block text-base text-center w-1/6
                                                   font-medium border border-neutral-400 
                                                   rounded py-2 text-secondary-600 cursor-pointer 
                                                   hover:text-white hover:bg-neutral-400
                                                   transition duration-150 ease-in-out">
                                    Upload
                                </label>
                                <input type="file" id="profile-picture" accept="image/*" className="hidden" onChange={handleProfilePictureChange} />
                                {/* Clear Profile Picture */}
                                <button
                                    type="button"
                                    className="text-base text-center w-1/6
                                                   border border-danger-400 rounded py-2 
                                                    font-medium text-danger-600 cursor-pointer 
                                                    hover:text-white hover:bg-danger-400
                                                    transition duration-150 ease-in-out"
                                    onClick={handleClearProfilePicture}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                        <div className="h-4"></div>
                        <div className="flex flex-col">
                            <label className="block text-base font-medium text-neutral-600">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(event) => setFullName(event.target.value)}
                                className="border border-neutral-200 rounded-md px-3 py-2 mt-1"
                            />
                        </div>
                        <div className="h-4"></div>
                        <div className="flex flex-col">
                            <label className="block text-base font-medium text-neutral-600">NUS Email</label>
                            <input type="email" value={email} className="border border-neutral-200 rounded-md px-3 py-2 mt-1" disabled />
                        </div>
                        <div className="h-4"></div>
                        <div className="flex flex-col">
                            <label className="block text-base font-medium text-neutral-600">Phone Number</label>
                            <p className="text-sm text-neutral-400">Example: 91234567</p>
                            <input
                                type="tel"
                                value={phoneNumber}
                                pattern="[0-9]{8}"
                                onChange={(event) => setPhoneNumber(event.target.value)}
                                className="border border-neutral-200 rounded-md px-3 py-2 mt-1" />
                        </div>
                        <div className="h-4"></div>
                        <div className="flex flex-col">
                            <label className="block text-base font-medium text-neutral-600">Faculty</label>
                            <Listbox value={faculty} onChange={setFaculty}>
                                <div className="relative mt-1">
                                    <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                                        <span className="block truncate">{faculty}</span>
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
                        <div className="h-4"></div>
                        <div className="flex flex-col">
                            <label className="block text-base font-medium text-neutral-600">Major</label>
                            <input
                                type="text"
                                value={major}
                                onChange={(event) => setMajor(event.target.value)}
                                className="border border-neutral-200 rounded-md px-3 py-2 mt-1"
                            />
                        </div>
                        <div className="h-4"></div>
                        <div className="flex flex-col">
                            <label className="block text-base font-medium text-neutral-600">Year of Study</label>
                            <input
                                type="number"
                                min={1}
                                max={4}
                                value={yearOfStudy}
                                onChange={(event) => setYearOfStudy(event.target.value)}
                                className="border border-neutral-200 rounded-md px-3 py-2 mt-1" />
                        </div>
                        <div className="h-4"></div>
                        <div className="flex flex-col">
                            <label className="block text-base font-medium text-neutral-600">Telegram Handle</label>
                            <input
                                type="text"
                                value={telegramHandle}
                                onChange={(event) => setTelegramHandle(event.target.value)}
                                className="border border-neutral-200 rounded-md px-3 py-2 mt-1"
                            />
                        </div>
                        <div className="h-4"></div>
                        <div className="flex flex-col">
                            <label className="block text-base font-medium text-neutral-600">Dietary Restrictions</label>
                            <input
                                type="text"
                                value={dietaryRestrictions}
                                onChange={(event) => setDietaryRestrictions(event.target.value)}
                                className="border border-neutral-200 rounded-md px-3 py-2 mt-1"
                            />
                        </div>
                        <div className="h-4"></div>
                        {/* Skills Tag Input */}
                        <div className="flex flex-col">
                            <label className="block text-base font-medium text-neutral-600">Skills</label>
                            <div className="bg-white border border-gray-300 rounded-lg h-28 overflow-y-scroll">
                                <div className="flex flex-row gap-2 p-2">
                                    <div className="flex flex-wrap">
                                        {
                                            formSkills.length > 0 ? formSkills.map((skill, index) => (
                                                <div key={index} className="bg-gray-200 text-gray-700 text-sm font-semibold px-2 py-1 mr-1 my-1 rounded-full">
                                                    {skill}
                                                    {/* Button to delete */}
                                                    <XCircleIcon
                                                        className="w-4 h-4 inline-block ml-1 cursor-pointer"
                                                        onClick={() => {
                                                            let newSkills = formSkills.filter((s) => s !== skill);
                                                            setFormSkills(newSkills);
                                                        }}
                                                    />
                                                </div>
                                            )) : null
                                        }
                                        <input
                                            className={formSkills.length == 0 ? "w-screen text-gray-700 text-sm font-semibold px-2 mr-1 border-none outline-none" : "text-gray-700 text-sm font-semibold px-2 mr-1 border-none outline-none"}
                                            value={skillsInput}
                                            onChange={(event) => {
                                                setSkillsInput(event.target.value);
                                            }}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Backspace' && !skillsInput) {
                                                    setFormSkills(formSkills.slice(0, -1));
                                                } else if (event.key === 'Enter') {
                                                    if (skillsInput.trim() === "") {
                                                        return;
                                                    }
                                                    if (formSkills.includes(event.target.value.trim())) {
                                                        return;
                                                    }
                                                    setFormSkills([...formSkills, skillsInput.trim()]);
                                                    setSkillsInput("");
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="h-4"></div>
                        <div className="flex justify-end">
                            <button
                                className="bg-primary-600 text-white text-center hover:bg-primary-500 
                                             px-8 py-2 font-medium rounded-md transition duration-150 ease-in-out"
                            >
                                Save
                            </button>
                        </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </AuthProtected>
    )
}

export default UserProfile