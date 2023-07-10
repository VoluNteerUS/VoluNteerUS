import Navbar from "../../components/navigation/Navbar";
import AuthProtected from "../../common/protection/AuthProtected";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Pagination from "../../components/navigation/Pagination";
import axios from "axios";
import moment from "moment";

function Records() {
    const persistedUserState = useSelector((state) => state.user);
    const user = persistedUserState?.user || "Unknown";
    const [history, setHistory] = useState([]);
    const [totalHours, setTotalHours] = useState({ hours: 0, minutes: 0 });
    const [paginationState, setPaginationState] = useState({
        history: {
          currentPage: 1,
          limit: 5,
          totalItems: 0,
          totalPages: 0,
        },
    });

    const getHistory = async () => {
        try {
            const historyURL = new URL(`/responses/history?user_id=${user?.id}&page=${paginationState.history.currentPage}&limit=${paginationState.history.limit}`, process.env.REACT_APP_BACKEND_API);
            const historyRes = await axios.get(historyURL);
            const paginatedHistory = { ...historyRes.data };
            setHistory(paginatedHistory);
            setPaginationState({
                history: {
                  ...paginationState.history,
                  totalItems: paginatedHistory.totalItems,
                  totalPages: paginatedHistory.totalPages,
                },
            })
            const totalHoursURL = new URL(`/responses/totalHours?user_id=${user?.id}`, process.env.REACT_APP_BACKEND_API);
            const totalHoursRes = await axios.get(totalHoursURL);
            const totalHours = totalHoursRes.data;
            const hours = Math.floor(totalHours / 1);
            const mins = Math.round(totalHours % 1 * 60);
            setTotalHours({ hours: hours, minutes: mins });
        } catch (err) {
            console.error({ err });
        }
    }

    useEffect(() => {
        getHistory();
    }, [paginationState.history.currentPage]);

    const handleHistoryPageChange = (page) => {
        setPaginationState({
          ...paginationState,
          history: {
            ...paginationState.history,
            currentPage: page
          }
        });
      }
    
      const handleHistoryNextPage = () => {
        setPaginationState({ 
          ...paginationState, 
          history: {
            ...paginationState.history,
            currentPage: paginationState.history.currentPage + 1
          }
        });
      }
    
      const handleHistoryPrevPage = () => {
        setPaginationState({ 
          ...paginationState, 
          history: {
            ...paginationState.history,
            currentPage: paginationState.history.currentPage - 1
          }
        });
      }

    return (
        <AuthProtected>
            <Navbar />
            <div className="w-screen lg:w-5/6 block mx-auto space-y-10">
                <div className="text-2xl my-10 font-bold">
                    <h1>Volunteering history</h1>
                </div>
                <div className="grid md:grid-cols-4 grid-cols-2">
                <div className="bg-neutral-100 rounded shadow p-5">
                    <p className="text-xs md:text-sm font-semibold text-neutral-600 uppercase tracking-wider">Total</p>
                    <p className="text-xl md:text-2xl font-semibold text-pink-400 tracking-wider">{ totalHours.hours }h { totalHours.minutes }m</p>
                </div>
                </div>
                <div className="bg-neutral-100 rounded shadow p-5">
                    <div className="text-sm grid grid-cols-4 text-left border-b">
                        <p className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Event Name</p>
                        <p className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Start date & time</p>
                        <p className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">End date & time</p>
                        <p className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Hours</p>
                    </div>
                    {history?.result?.map((response) => {
                      const hours = response?.hours === -1 ? Math.floor(response.event['defaultHours'] / 1) : Math.floor(response?.hours / 1);
                      const mins = response?.hours === -1 ? Math.round(response.event['defaultHours'] % 1 * 60) : Math.round(response?.hours % 1 * 60);
                      return (
                        <div className="text-sm grid grid-cols-4 border-b items-center">
                            <p className="px-6 py-4 text-sm md:text-base text-neutral-600 font-medium">{response?.event['title']}</p>
                            <p className="px-6 py-4 text-sm md:text-base text-neutral-600 font-medium">{moment(`${response?.event['date'][0]} ${response?.event['date'][2]}`).format('Do MMMM YYYY, h:mm A')}</p>
                            <p className="px-6 py-4 text-sm md:text-base text-neutral-600 font-medium">{moment(`${response?.event['date'][1]} ${response?.event['date'][3]}`).format('Do MMMM YYYY, h:mm A')}</p>
                            { response?.attendance === "Present"
                              ? <p className="px-6 py-4 text-sm md:text-base text-green-600 font-bold tracking-wider">+ {hours}h {mins}m</p>
                              : response?.attendance === "Late"
                                ? <p className="px-6 py-4 text-sm md:text-base text-yellow-600 font-bold tracking-wide">+ {hours}h {mins}m</p>
                                : <p className="px-6 py-4 text-sm md:text-base text-red-600 font-bold tracking-wide">0</p>
                            }
                        </div>
                      )
                    }
                    )}
                    <Pagination
                        currentPage={paginationState?.history?.currentPage}
                        limit={paginationState?.history?.limit}
                        totalItems={paginationState?.history?.totalItems}
                        totalPages={paginationState?.history?.totalPages}
                        handlePageChange={handleHistoryPageChange}
                        handleNextPage={handleHistoryNextPage}
                        handlePrevPage={handleHistoryPrevPage}
                    />  
                </div>
            </div>
        </AuthProtected>
    )
}

export default Records;
