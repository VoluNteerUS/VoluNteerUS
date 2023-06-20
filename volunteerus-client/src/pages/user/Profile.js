import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import Navbar from "../../components/navigation/Navbar"
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import AuthProtected from "../../common/protection/AuthProtected";

function UserProfile() {
    const persistedUserState = useSelector((state) => state.user);
    const user = persistedUserState?.user || 'Unknown';
    return (
        <AuthProtected>
            <Navbar />
            <div className="block mx-auto lg:w-3/4">
                <div className="h-4"></div>
                {/* Breadcrumbs */}
                <div className="flex items-center text-base py-2 px-3 md:px-0">
                    <Link to="/" className="text-sky-600 hover:text-sky-700 transition duration-150 ease-in-out">Home</Link>
                    <span className="mx-2">/</span>
                    <Link to="/profile" className="text-neutral-600 transition duration-150 ease-in-out">Profile</Link>
                </div>
                <div className="h-6"></div>
                {/* Page Title */}
                <h1 className="text-3xl font-bold pb-4 px-3 md:px-0">Profile</h1>
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 px-3 md:col-span-4 md:px-0">
                        <div className="bg-neutral-100 rounded shadow p-5">
                            <div className="flex flex-col items-center">
                                <img
                                    className="h-20 w-20 rounded-full"
                                    src={`https://ui-avatars.com/api/?name=${user.full_name ?? ''}&background=0D8ABC&color=fff`}
                                    alt="Profile Picture"
                                />
                                <h2 className="text-2xl font-semibold py-2">{user.full_name}</h2>
                            </div>
                            <div className="flex flex-col items-start">
                                <label className="block text-base font-medium text-neutral-600">Profile Information</label>
                                <div className="flex items-center py-2">
                                    <EnvelopeIcon className="h-5 w-5 text-neutral-600" />
                                    <span className="ml-2 text-neutral-600">{user.email}</span>
                                </div>
                                <div className="flex items-center py-2">
                                    <PhoneIcon className="h-5 w-5 text-neutral-600" />
                                    <span className="ml-2 text-neutral-600">{user.phone_number}</span>
                                </div>
                            </div>
                            {/* Skills */}
                            <div className="py-3">
                                <label className="block text-base font-medium text-neutral-600">Skills</label>
                                <span className="text-neutral-600">{user.skills ?? 'Not Specified'}</span>
                            </div>
                            <Link to="/profile/edit" className="block mx-auto bg-blue-600 text-white text-center hover:bg-blue-500 px-8 py-2 font-medium rounded-md transition duration-150 ease-in-out">Edit Profile</Link>
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
                                <span className="text-neutral-600">{user.faculty ?? 'Not Specified'} / {user.major ?? 'Not Specified'}</span>
                            </div>
                            {/* Year of Study */}
                            <div className="py-3">
                                <label className="block text-base font-medium text-neutral-600">Year of Study</label>
                                <span className="text-neutral-600">{user.year_of_study ?? 'Not Specified'}</span>
                            </div>
                            {/* Telegram Handle */}
                            <div className="py-2">
                                <label className="block text-base font-medium text-neutral-600">Telegram Handle</label>
                                <span className="text-neutral-600">{user.telegram_handle ?? 'Not Specified'}</span>
                            </div>
                            {/* Dietary Preferences */}
                            <div className="py-2">
                                <label className="block text-base font-medium text-neutral-600">Dietary Preferences</label>
                                <span className="text-neutral-600">{user.diet ?? 'Not Specified'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthProtected>
    )
}

export default UserProfile