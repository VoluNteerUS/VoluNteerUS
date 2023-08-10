import React, { useEffect, useState } from "react";
import imageHandHoldingHeart from "../../assets/images/hand-holding-heart.png"
import imagePerson from "../../assets/images/person.png"
import imageCalender from "../../assets/images/calender-icon.png";
import imageLocation from "../../assets/images/location-icon.png";
// temporary image for organizations
import imageOrganization from "../../assets/images/organization-icon.png";
import { MagnifyingGlassIcon, FunnelIcon, ArrowsUpDownIcon, TagIcon, LockClosedIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { Listbox } from "@headlessui/react";
import moment from "moment";
import Pagination from "../../components/navigation/Pagination";
import { api } from "../../services/api-service";

function Events() {
  const filters = [
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

  const sorts = [
    'Event title',
    'Date: latest to earliest',
    'Date: earliest to latest'
  ]

  const [allEvents, setAllEvents] = useState([]);
  const location = useLocation();
  const [filteredCategory, setFilteredCategory] = useState(location?.state?.category ? [location?.state?.category] : filters);
  const [filteredEvents, setFilteredEvents] = useState(allEvents);
  const [sort, setSort] = useState([...sorts.slice(0, 1)]);
  const [queryEvents, setQueryEvents] = useState("");
  const [state, setState] = useState({
    events: [],
    currentPage: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 0,
    category: [...filters],
    sort: [...sorts.slice(0, 1)],
  })

  useEffect(() => {
    getAllEvents();
  }, [state.currentPage, queryEvents, filteredCategory]);

  const getAllEvents = () => {    
    api.getUpcomingEvents(state.currentPage, state.limit, queryEvents, filteredCategory)
      .then((res) => {
        const paginatedEvents = { ...res.data };
        console.log(paginatedEvents);
        const events = paginatedEvents.result;
        setAllEvents(events);
        setState({
          ...state,
          events: paginatedEvents.result,
          totalItems: paginatedEvents.totalItems,
          totalPages: paginatedEvents.totalPages
        });
      })
      .catch(err => console.error({ err }));

    // const eventsURL = new URL(`/events?page=${state.currentPage}&limit=${state.limit}`, process.env.REACT_APP_BACKEND_API);
    // axios.get(eventsURL)
    //   .then((res) => {
    //     const paginatedEvents = { ...res.data };
    //     const events = paginatedEvents.result;
    //     setAllEvents(events);
    //     setState({ 
    //       ...state, 
    //       events: paginatedEvents.result,
    //       totalItems: paginatedEvents.totalItems,
    //       totalPages: paginatedEvents.totalPages
    //     });
    //   })
    // .catch(err => console.error({ err }));
  }

  const getEvent = (title) => {
    api.getUpcomingEvents(state.currentPage, state.limit, title, filteredCategory)
      .then((res) => {
        const paginatedEvents = { ...res.data };
        console.log(paginatedEvents);
        const events = paginatedEvents.result;
        setAllEvents(events);
        setState({
          ...state,
          events: paginatedEvents.result,
          totalItems: paginatedEvents.totalItems,
          totalPages: paginatedEvents.totalPages
        });
      })
      .catch(err => console.error({ err }));
  }

  useEffect(() => {
    // getAllEvents();
    // if user clicked on an event to navigate to detailed event
    if (location?.state) {
      getEvent(location.state.title);
      setQueryEvents(location.state.title);
    }
  }, []);

  // sort + filter according to search query
  useEffect(() => {
    // let newAllEvents = allEvents.filter(event => toFilter(event));
    let newAllEvents = allEvents
    sort === 'Event title' ? newAllEvents.sort((a, b) => a.title - b.title)
      : sort === 'Date: latest to earliest'
        ? newAllEvents.sort((a, b) => new Date(a.date[0]).getTime() === new Date(b.date[0]).getTime()
          ? b.date[2] - a.date[2]
          : new Date(b.date[0]).getTime() - new Date(a.date[0]).getTime())
        : newAllEvents.sort((a, b) => new Date(a.date[0]).getTime() === new Date(b.date[0]).getTime()
          ? a.date[2] - b.date[2]
          : new Date(a.date[0]).getTime() - new Date(b.date[0]).getTime());

    // console.log(queryEvents);
    // const searchEvents = queryEvents ? newAllEvents.filter((event) => {
    //   return event.title.toLowerCase().includes(queryEvents.toLowerCase());
    // }) : newAllEvents;

    // setFilteredEvents(searchEvents);
    setFilteredEvents(newAllEvents);
  }, [filteredCategory, allEvents, sort, queryEvents])

  const toFilter = ((event) => {
    let eventCategoryCopy = event.category.map(cat => filteredCategory.includes(cat));
    return eventCategoryCopy.includes(true);
  })

  const handleNextPage = () => {
    setState({ ...state, currentPage: state.currentPage + 1 });
  }

  const handlePrevPage = () => {
    setState({ ...state, currentPage: state.currentPage - 1 });
  }

  const handlePageChange = (page) => {
    setState({ ...state, currentPage: page });
  }

  return (
    <>
      <section className="bg-pink-100 pt-10 pb-5 space-y-10">
        <div className="flex flex-row justify-center space-x-5">
          <h1 className="md:text-5xl text-2xl font-bold flex items-center">Upcoming Events</h1>
          <img src={imageHandHoldingHeart} alt="asthetic" className="w-16 h-16 md:w-20 md:h-20" />
        </div>
        {/* Search bar, filter button, sort button */}
        <div className="flex sm:flex-row flex-col md:basis-1/2 lg:basis-1/3 xl:basis-1/4 sm:items-center justify-center space-x-5 gap-3">
          <form method="GET" className="w-full px-3 md:px-0 sm:w-3/4 md:w-1/2 lg:w-1/3">
            <div className="relative text-gray-600 focus-within:text-gray-400">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <button type="submit" className="p-1 focus:outline-none focus:shadow-outline">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 object-contain" aria-hidden="true" />
                </button>
              </span>
              <input
                type="search"
                className="h-10 py-2 pe-2 text-sm text-gray-700 bg-white rounded-md pl-10 focus:outline-blue-500 w-full"
                placeholder="Search events"
                value={queryEvents}
                onChange={(e) => {
                  setQueryEvents(e.target.value);
                }}
              />
            </div>
          </form>
          <div className="flex flex-row space-x-2">
            {/* filter button */}
            <div className="flex flex-col">
              <Listbox value={filteredCategory} onChange={setFilteredCategory} multiple>
                <div className="relative">
                  <Listbox.Button className="relative bg-white rounded-3xl p-2 border border-black flex items-center space-x-1 shadow-md">
                    <p>Filter</p>
                    <FunnelIcon className="fill-black w-5 h-5 flex" aria-hidden="true" />
                  </Listbox.Button>

                  <Listbox.Options className="absolute overflow-auto shadow-lg bg-white">
                    {filters.map((filter) => (
                      <Listbox.Option
                        key={filter}
                        value={filter}
                        className={({ active }) =>
                          `relative select-none py-2 px-2 ${active ? 'bg-pink-400 text-white' : 'text-black'
                          }`
                        } >

                        <div className="flex flex-row">
                          {filteredCategory.includes(filter) ? (
                            <span className="text-black">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                          <span
                            className={`block truncate ${filteredCategory.includes(filter) ? 'font-medium' : 'font-normal'
                              }`}
                          >
                            {filter}
                          </span>
                        </div>
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
            {/*  sort button */}
            <div className="flex flex-col">
              <Listbox value={sort} onChange={setSort} >
                <div className="relative">
                  <Listbox.Button className="relative bg-white rounded-3xl p-2 border border-black flex items-center space-x-1 shadow-md">
                    <p>Sort</p>
                    <ArrowsUpDownIcon className="fill-black w-5 h-5 flex" aria-hidden="true" />
                  </Listbox.Button>

                  <Listbox.Options className="absolute overflow-auto shadow-lg bg-white">
                    {sorts.map((s) => (
                      <Listbox.Option
                        key={s}
                        value={s}
                        className={({ active }) =>
                          `relative select-none py-2 px-2 ${active ? 'bg-pink-400 text-white' : 'text-black'
                          }`
                        } >

                        <div className="flex flex-row">
                          {sort.includes(s) ? (
                            <span className="text-black">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                          <span
                            className={`block truncate ${sort.includes(s) ? 'font-medium' : 'font-normal'
                              }`}
                          >
                            {s}
                          </span>
                        </div>
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
          </div>
        </div>
      </section>
      <div className="flex flex-row flex-wrap">
        <img src={imagePerson} alt="asthetics" className="w-15 h-40 md:-translate-y-20 -m-2" />
        {/* List of all events */}
        <div>
          {filteredEvents.map((event, key) => (
            <Link to={`/events/${event._id}`} key={key} className="flex md:flex-row flex-col ml-5 my-5 lg:mr-20 mr-5 border border-black">
              <img src={event.image_url} alt="event" className="lg:w-1/5 md:w-1/3 object-fill" />
              <div className="m-5 space-y-5">
                <h1 className="text-xl md:text-2xl font-bold text-center hover:text-neutral-600"><Link to={`/events/${event._id}`}>{event.title}</Link></h1>
                <div className="flex lg:flex-row flex-col-reverse md:space-x-8 gap-4 lg:gap-0">
                  <p className="hidden md:block lg:w-1/2 xl:w-2/3 md:text-base md:mx-5">{event.description}</p>
                  <div className="lg:w-1/2 xl:w-1/3 space-y-2">
                    <div className="flex flex-row space-x-3">
                      <img src={imageCalender} alt="calender icon" className="w-5 h-5" />
                      <div>
                        <p>{event.date[0] === event.date[1] ? moment(`${event.date[0]}`).format('LL') : moment(`${event.date[0]}`).format('LL') + ' - ' + moment(`${event.date[1]}`).format('LL')}</p>
                        <p>{moment(`${event.date[0]} ${event.date[2]}`).format('h:mm A')} - {moment(`${event.date[0]} ${event.date[3]}`).format('h:mm A')}</p>
                      </div>
                    </div>
                    <div className="flex flex-row space-x-3">
                      <img src={imageLocation} alt="location icon" className="w-5 h-5" />
                      <p>{event.location}</p>
                    </div>
                    <div className="flex flex-row space-x-3">
                      <img src={imageOrganization} alt="Organization icon" className="w-5 h-5" />
                      <p>{event.organized_by["name"]}</p>
                    </div>
                    <div className="flex flex-row space-x-3">
                      <TagIcon className="w-5 h-5" />
                      <p>{event.category.join(", ")}</p>
                    </div>
                    <div className="flex flex-row space-x-3">
                      <LockClosedIcon className="w-5 h-5" />
                      <p>{moment(`${event.signup_by}`).format('LL')}</p>
                    </div>
                    <div className="flex w-full flex-row space-x-3">
                      <Link className="flex items-center justify-center w-full 2xl:w-2/3 bg-primary-600 text-white rounded-lg py-2 lg:px-20 px-10 shadow-md hover:bg-primary-300" to={`/events/${event._id}/signup`}>
                          Sign up
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
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
    </>
  );
}

export default Events;