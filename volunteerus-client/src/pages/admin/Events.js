import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import Pagination from "../../components/navigation/Pagination";
import AppDialog from "../../components/AppDialog";
import { CheckIcon, FunnelIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline"
import { Listbox } from "@headlessui/react";
import AdminProtected from "../../common/protection/AdminProtected";
import { api } from "../../services/api-service";


function AdminEventDashboard() {
  const filters = [
    'All',
    'Elderly',
    'Migrant Workers',
    'Patients',
    'PWID',
    'Youth',
    'Local',
    'Overseas',
    'Special project',
    'Regular project'
  ]

  const [state, setState] = useState({
    events: [],
    currentPage: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 0,
    searchQuery: "",
  });

  const persistedUserState = useSelector((state) => state.user);
  const user = persistedUserState.user;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState({});
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.getAllEvents(state.searchQuery, state.currentPage, state.limit, selectedFilter);
        const paginatedEvents = { ...res.data };
        setState({
          ...state,
          events: paginatedEvents.result,
          totalItems: paginatedEvents.totalItems,
          totalPages: paginatedEvents.totalPages
        });
      } catch (err) {
        console.error({ err });
      }
    }

    const getTotalCount = async () => {
      try {
        const res = await api.getEventCount();
        setTotalCount(res.data);
      } catch (err) {
        console.error({ err });
      }
    }

    fetchEvents();
    getTotalCount();
  }, [state.currentPage, state.searchQuery, eventToDelete, selectedFilter]);

  const handlePageChange = (page) => {
    setState({ ...state, currentPage: page });
  }

  const handleNextPage = () => {
    setState({ ...state, currentPage: state.currentPage + 1 });
  }

  const handlePrevPage = () => {
    setState({ ...state, currentPage: state.currentPage - 1 });
  }

  const handleDelete = (event) => {
    setEventToDelete(event);
    setIsDialogOpen(true);
  }

  const handleConfirmDelete = async () => {
    await api.deleteEvent(localStorage.getItem("token"), eventToDelete._id, user.role)
      .then((res) => {
        const response = { ...res.data };
        setIsDialogOpen(false);
      })
      .catch(err => console.error({ err }));
  }

  const handleCancelDelete = () => {
    setEventToDelete({});
    setIsDialogOpen(false);
  }


  return (
    <AdminProtected>
      <div className="py-8">
        <div className="block mx-auto lg:w-3/4 bg-neutral-100 rounded-lg p-8">
          <div className="pb-4 flex flex-row flex-wrap justify-between items-center">
            <div className="flex flex-col">
              <h1 className="font-bold text-3xl">Events</h1>
              <p className="text-gray-600">{totalCount} events created</p>
            </div>
            <div className="flex flex-row flex-wrap gap-4 mb-4 lg:mb-0">
              <div className="flex">
                {/* Search */}
                <form method="GET">
                  <div className="relative text-gray-600 focus-within:text-gray-400 rounded-md shadow-md w-80">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                      <button type="submit" className="p-1 focus:outline-none focus:shadow-outline">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 object-contain" aria-hidden="true" />
                      </button>
                    </span>
                    <input
                      type="search"
                      className="h-10 py-2 pe-2 text-sm text-gray-700 bg-white rounded-md pl-10 focus:outline-blue-500 w-full"
                      placeholder="Search events"
                      value={state.searchQuery}
                      onChange={(e) => {
                        setState({
                          ...state,
                          searchQuery: e.target.value,
                        });
                      }}
                    />
                  </div>
                </form>
              </div>
              <div className="flex">
                {/* Category Filters */}
                <Listbox value={selectedFilter} onChange={setSelectedFilter}>
                  <div className="relative w-48">
                    <Listbox.Button className="relative h-10 w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75 sm:text-sm">
                      <span className="block truncate">{selectedFilter}</span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <FunnelIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-20">
                      {filters.map((filter, filterIdx) => (
                        <Listbox.Option
                          key={filterIdx}
                          className={({ active }) =>
                            `${active ? 'text-neutral-900 bg-primary-300' : 'text-gray-900'}
                            cursor-default select-none relative py-2 pl-10 pr-4`
                          }
                          value={filter}
                        >
                          {({ selected, active }) => (
                            <>
                              <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                                {filter}
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
                  </div>
                </Listbox>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-primary-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">Event Name</th>
                  <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">Organizer</th>
                  <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">Event Start Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">Event End Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {
                  state.events.map((event) => {
                    return (
                      <tr className="bg-white" key={event._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">{event.organized_by.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">{moment(`${event.date[0]} ${event.date[2]}`).format('Do MMMM YYYY, h:mm A')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">{moment(`${event.date[1]} ${event.date[3]}`).format('Do MMMM YYYY, h:mm A')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">
                          <div className="flex items-center">
                            <Link to={`/events/${event._id}/edit`} className="flex items-center space-x-2 text-secondary-600 hover:text-secondary-700 ">
                              <span>Edit</span>
                              <PencilIcon className="w-5 h-5" aria-hidden="true" />
                            </Link>
                            <span className="px-2">|</span>
                            <button
                              type="button"
                              className="flex items-center space-x-2 text-danger-600 hover:text-danger-400"
                              onClick={() => handleDelete(event)}
                            >
                              <span>Delete</span>
                              <TrashIcon className="w-5 h-5" aria-hidden="true" />
                            </button>
                          </div>
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
      {isDialogOpen && (
        <AppDialog
          isOpen={isDialogOpen}
          title="Confirm Delete"
          description={`Are you sure you want to delete the event "${eventToDelete.title}"?`}
          warningMessage={`This action cannot be undone.`}
          actionName="Delete"
          handleAction={handleConfirmDelete}
          handleClose={handleCancelDelete}
        />
      )}
    </AdminProtected>
  )
}

export default AdminEventDashboard;