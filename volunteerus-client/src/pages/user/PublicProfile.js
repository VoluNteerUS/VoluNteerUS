import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import Pagination from "../../components/navigation/Pagination";
import { api } from "../../services/api-service";

function PublicUserProfile() {
    const { userId } = useParams();
    const [user, setUser] = useState({});
    const [volunteeringHistory, setVolunteeringHistory] = useState([]);
    const [paginationState, setPaginationState] = useState({
        history: {
            currentPage: 1,
            limit: 5,
            totalItems: 0,
            totalPages: 0,
        },
    });

    const getUserProfile = async () => {
        await api.getUser(localStorage.getItem("token"), userId).then(res => setUser(res.data));
    }

    const getVolunteeringHistory = async () => {
        await api.getVolunteeringHistory(
            localStorage.getItem("token"), 
            userId, 
            paginationState.history.currentPage, 
            paginationState.history.limit
        ).then(res => {
            setVolunteeringHistory(res.data.result);
            setPaginationState({
                history: {
                    ...paginationState.history,
                    currentPage: res.data.currentPage,
                    totalItems: res.data.totalItems,
                    totalPages: res.data.totalPages,
                },
            });
        });
    }

    const handlePageChange = (page) => {
        setPaginationState({
            ...paginationState,
            history: {
                ...paginationState.history,
                currentPage: page
            }
        });
    }

    const handleNextPage = () => {
        setPaginationState({
            ...paginationState,
            history: {
                ...paginationState.history,
                currentPage: paginationState.history.currentPage + 1
            }
        });
    }

    const handlePrevPage = () => {
        setPaginationState({
            ...paginationState,
            history: {
                ...paginationState.history,
                currentPage: paginationState.history.currentPage - 1
            }
        });
    }

    useEffect(() => {
        getUserProfile();
        getVolunteeringHistory();
    }, []);

    return (
        <>
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
                                <h2 className="text-2xl font-medium py-2">{user.full_name}</h2>
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
                                <div className="flex gap-2">
                                 {
                                        user?.skills?.length > 0 ? user.skills.map((skill, index) => (
                                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                                {skill}
                                            </span>
                                        )) : <span className="text-neutral-600">Not Specified</span>
                                    }
                                </div>
                                {/* <span className="text-neutral-600">{user.skills ?? 'Not Specified'}</span> */}
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
                    {/* Volunteering History */}
                    <div className="col-span-12 px-3 md:px-0 pb-3">
                        <div className="bg-neutral-100 rounded shadow p-5">
                            <h2 className="font-semibold text-2xl">Volunteering History</h2>
                            <div className="overflow-x-auto">
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr>
                                            <th className="pe-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Event Name</th>
                                            <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Start Date & Time</th>
                                            <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">End Date & Time</th>
                                            <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Shifts Completed</th>
                                            <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Hours Completed</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            volunteeringHistory?.length > 0 && volunteeringHistory.map((history, index) => {
                                                console.log(history);
                                                const shifts = history?.shifts.map((shift, index) => shift ? index : -1).filter(days => days != -1);
                                                const eventHours = shifts?.reduce((sum, shift) => sum + (history?.hours[shift] === -1 ? history?.event['defaultHours'][shift] : history?.hours[shift]), 0);
                                                const hours = Math.floor(eventHours / 1);
                                                const mins = Math.round(eventHours % 1 * 60);
                                                return (
                                                    <tr key={index}>
                                                        <td className="pe-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium hover:text-neutral-400">
                                                            <Link to={`/events/${history.event._id}`}>{history.event.title}</Link>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600">{moment(`${history?.event['date'][0]} ${history?.event['date'][2]}`).format('Do MMMM YYYY, h:mm A')}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600">{moment(`${history?.event['date'][1]} ${history?.event['date'][3]}`).format('Do MMMM YYYY, h:mm A')}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600">
                                                        { history?.shifts?.map((shift, index) => shift ? index : -1).filter(days => days !== -1).map((days) => ( 
                                                            <p className="whitespace-nowrap bg-primary-600 text-white text-sm px-3 rounded-full text-center">{ moment(`${history?.event['date'][0]}`).add(days, 'days').format('DD MMMM YYYY') }</p>
                                                        ))}
                                                        </td>
                                                        { eventHours !== 0 || volunteeringHistory?.attendance?.includes("Present") || volunteeringHistory?.attendance?.includes("Late") 
                                                            ? <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-green-600 font-bold tracking-wider">+ {hours}h {mins}m</td>
                                                            : <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-red-600 font-bold tracking-wide">0</td>
                                                        }
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                                <Pagination 
                                    currentPage={paginationState?.history?.currentPage}
                                    limit={paginationState?.history?.limit}
                                    totalItems={paginationState?.history?.totalItems}
                                    totalPages={paginationState?.history?.totalPages}
                                    handlePageChange={handlePageChange}
                                    handleNextPage={handleNextPage}
                                    handlePrevPage={handlePrevPage}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PublicUserProfile;