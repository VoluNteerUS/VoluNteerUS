import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Navbar from "../../components/navigation/Navbar";
import axios from "axios";
import { setEvents } from "../../actions/eventActions";
import moment from "moment";
import Pagination from "../../components/navigation/Pagination";


function AdminEventDashboard() {
  const dispatch = useDispatch();

  const [state, setState] = useState({
    events: useSelector((state) => state.events).events,
    currentPage: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 0,
    searchQuery: "",
  });

  useEffect(() => {
    const getEvents = async () => {
      try {
        const eventsURL = new URL(`/events?page=${state.currentPage}&limit=${state.limit}`, process.env.REACT_APP_BACKEND_API);
        const res = await axios.get(eventsURL);
        const paginatedEvents = { ...res.data };
        setState({
          ...state,
          events: paginatedEvents.result,
          totalItems: paginatedEvents.totalItems,
          totalPages: paginatedEvents.totalPages
        });
        dispatch(setEvents(paginatedEvents.result));
      } catch (err) {
        console.error({ err });
      }
    }

    getEvents();
  }, [dispatch, state.currentPage]);

  const handlePageChange = (page) => {
    setState({ ...state, currentPage: page });
  }

  const handleNextPage = () => {
    setState({ ...state, currentPage: state.currentPage + 1 });
  }

  const handlePrevPage = () => {
    setState({ ...state, currentPage: state.currentPage - 1 });
  }

  return (
    <>
      <Navbar />
      <div className="py-8">
        <div className="block mx-auto lg:w-3/4 bg-neutral-100 rounded-lg p-8">
          <div className="pb-4">
            <h1 className="font-bold text-3xl">Events</h1>
            <p className="text-gray-600">{state.totalItems} events created</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead>
                <tr>
                  <th className="pe-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Event Name</th>
                  <th className="pe-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Organizer</th>
                  <th className="pe-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Event Start Date & Time</th>
                  <th className="pe-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Event End Date & Time</th>
                  <th className="pe-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {
                  state.events.map((event) => {
                    return (
                      <tr key={event._id}>
                        <td className="pe-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">
                          {
                            event.title.length > 20 ? (
                              <>
                                {event.title.slice(0, 30)}...
                              </>
                            ) : (
                              <>
                                {event.title}
                              </>
                            )  
                          }
                        </td>
                        <td className="pe-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">{event.organized_by.name}</td>
                        <td className="pe-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">{moment(`${event.date[0]} ${event.date[2]}`).format('Do MMMM YYYY, h:mm A')}</td>
                        <td className="pe-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">{moment(`${event.date[1]} ${event.date[3]}`).format('Do MMMM YYYY, h:mm A')}</td>
                        <td className="pe-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">
                          <Link to={`/events/${event._id}/edit`} className="text-primary-600 hover:text-primary-800">
                            Edit
                          </Link>
                          <span className="px-2">|</span>
                          <button type="button" className="text-primary-600 hover:text-primary-800">
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  }
                  )
                }
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <Pagination
            currentPage={state.currentPage}
            limit={state.limit}
            totalItems={state.totalItems}
            totalPages={state.totalPages}
            handlePageChange={handlePageChange}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
          />
        </div>
      </div>
    </>
  )
}

export default AdminEventDashboard;