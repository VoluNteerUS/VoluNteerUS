import AuthProtected from "../../common/protection/AuthProtected";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Pagination from "../../components/navigation/Pagination";
import moment from "moment";
import { Link } from "react-router-dom";
import { api } from "../../services/api-service";

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
      const historyRes = await api.getVolunteeringHistory(
        localStorage.getItem("token"), 
        user?.id, 
        paginationState.history.currentPage, 
        paginationState.history.limit
      );
      const paginatedHistory = { ...historyRes.data };
      setHistory(paginatedHistory);
      setPaginationState({
        history: {
          ...paginationState.history,
          totalItems: paginatedHistory.totalItems,
          totalPages: paginatedHistory.totalPages,
        },
      })
      const totalHoursRes = await api.getVolunteeringHours(
        localStorage.getItem("token"), 
        user?.id
      );
      console.log(totalHoursRes);
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
      <div className="w-screen lg:w-5/6 block mx-auto space-y-10">
        <div className="text-2xl my-10 font-bold">
          <h1>Volunteering history</h1>
        </div>
        <div className="grid md:grid-cols-4 grid-cols-2">
          <div className="bg-neutral-100 rounded shadow p-5">
            <p className="text-xs md:text-sm font-semibold text-neutral-600 uppercase tracking-wider">Total</p>
            <p className="text-xl md:text-2xl font-semibold text-pink-400 tracking-wider">{totalHours.hours}h {totalHours.minutes}m</p>
          </div>
        </div>
        <div className="bg-neutral-100 rounded shadow p-5">
          <div className="overflow-x-auto">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Event Name</th>
                <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Start date & time</th>
                <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">End date & time</th>
                <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Shifts completed</th>
                <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Hours earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {history?.result?.map((response) => {
                const shifts = response?.shifts.map((shift, index) => shift ? index : -1).filter(days => days !== -1);
                const eventHours = shifts?.reduce((sum, shift) => sum + (response?.hours[shift] === -1 ? response?.event['defaultHours'][shift] : response?.hours[shift]), 0);
                const hours = Math.floor(eventHours / 1);
                const mins = Math.round(eventHours % 1 * 60);
                return (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium hover:text-neutral-400"><Link to={`/events/${response?.event?._id}`}>{response?.event['title']}</Link></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">{moment(`${response?.event['date'][0]} ${response?.event['date'][2]}`).format('Do MMMM YYYY, h:mm A')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">{moment(`${response?.event['date'][1]} ${response?.event['date'][3]}`).format('Do MMMM YYYY, h:mm A')}</td>
                    <td className="px-6 py-4 space-y-1">
                      {response?.shifts?.map((shift, index) => shift ? index : -1).filter(days => days !== -1).map((days) => (
                        <p className="whitespace-nowrap bg-primary-600 text-white text-sm px-3 rounded-full text-center">{moment(`${response?.event['date'][0]}`).add(days, 'days').format('DD MMMM YYYY')}</p>
                      ))}
                    </td>
                    {eventHours !== 0 || response?.attendance?.includes("Present") || response?.attendance?.includes("Late")
                      ? <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-green-600 font-bold tracking-wider">+ {hours}h {mins}m</td>
                      : <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-red-600 font-bold tracking-wide">0</td>
                    }
                  </tr>
                )
              }
              )}
            </tbody>
          </div>
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
