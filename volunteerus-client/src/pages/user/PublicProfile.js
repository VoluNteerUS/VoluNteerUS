import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navigation/Navbar";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";


function PublicUserProfile() {
    const { userId } = useParams();
    const [user, setUser] = useState({});

    const getUserProfile = async () => {
        console.log(userId);
        const userURL = new URL(`/users/${userId}`, process.env.REACT_APP_BACKEND_API);
        await axios.get(userURL).then(res => setUser(res.data));
    }

    useEffect(() => {
        getUserProfile();
    }, []);

    return (
        <>
            <Navbar />
            <div className="block mx-auto px-4 lg:w-3/4 lg:px-0">
                <div className="h-8"></div>
                {/* Page Title */}
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
                                {/* <div className="flex">
                                    {
                                        skills.map((skill, index) => (
                                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mr-2">
                                                {skill}
                                            </span>
                                        ))
                                    }
                                </div> */}
                                <span className="text-neutral-600">{user.skills ?? 'Not Specified'}</span>
                            </div>
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
        </>
    );
}

export default PublicUserProfile;