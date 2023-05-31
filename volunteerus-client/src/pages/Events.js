import Navbar from "../components/navigation/Navbar";
import React, { useEffect, useState } from "react";
import imageHandHoldingHeart from "../assets/images/hand-holding-heart.png"
import imagePerson from "../assets/images/person.png"
import imageCalender from "../assets/images/calender-icon.png";
import imageLocation from "../assets/images/location-icon.png";
// temporary image for organizations
import imageOrganization from "../assets/images/organization-icon.png";
import axios from "axios";
import { MagnifyingGlassIcon, FunnelIcon, ArrowsUpDownIcon, TagIcon, LockClosedIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { Listbox } from "@headlessui/react";

function Events() {

  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    getAllEvents();
  }, []);

  const getAllEvents = () => {
    axios.get('http://localhost:5000/events')
      .then((res) => {
        const events = res.data;
        setAllEvents(events);
      })
    .catch(err => console.error({ err }));
  }

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
  const [filteredCategory, setFilteredCategory] = useState(filters);
  const [filteredEvents, setFilteredEvents] = useState(allEvents);
  const [sort, setSort] = useState([...sorts.slice(0, 1)]);

  useEffect(() => {
    let newAllEvents = allEvents.filter(event => toFilter(event));
    sort === 'Event title' ? newAllEvents.sort((a, b) => a.title - b.title)
      : sort === 'Date: latest to earliest' 
      ? newAllEvents.sort((a, b) => new Date(a.date[0]).getTime() === new Date(b.date[0]).getTime()
        ? b.date[2] - a.date[2] 
        : new Date(b.date[0]).getTime() - new Date(a.date[0]).getTime())
      : newAllEvents.sort((a, b) => new Date(a.date[0]).getTime() === new Date(b.date[0]).getTime()
        ? a.date[2] - b.date[2] 
        : new Date(a.date[0]).getTime() - new Date(b.date[0]).getTime());
    setFilteredEvents(newAllEvents);
  }, [filteredCategory, allEvents, sort])

  const toFilter = ((event) => {
    let eventCategoryCopy = event.category.map(cat => filteredCategory.includes(cat));
    return eventCategoryCopy.includes(true);
  })

  return (
    <>
      <Navbar />
      <section className="bg-pink-100 pt-10 pb-5 space-y-10">
        <div className="flex flex-row justify-center space-x-5">
          <h1 className="md:text-5xl text-2xl font-bold flex items-center">Upcoming Events</h1>
          <img src={imageHandHoldingHeart} alt="asthetic" className="w-20 h-20" />
        </div>
        {/* Search bar, filter button, sort button */}
        <div className="flex sm:flex-row flex-col md:basis-1/2 lg:basis-1/3 xl:basis-1/4 items-center justify-center space-x-5">
          <form method="GET" className="w-1/3">
            <div className="relative text-gray-600 focus-within:text-gray-400">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <button type="submit" className="p-1 focus:outline-none focus:shadow-outline">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 object-contain" aria-hidden="true" />
                </button>
              </span>
              <input type="search" name="q" className="h-10 py-2 text-sm text-gray-700 bg-white rounded-md pl-10 focus:outline-blue-500 w-full" placeholder="Search events" />
            </div>
          </form>
          <div className="flex flex-row space-x-2">
            {/* filter button */}
            <div className="flex flex-col"> 
              <Listbox value={filteredCategory} onChange={setFilteredCategory} multiple>
                <Listbox.Button className="bg-white rounded-3xl p-2 border border-black flex items-center space-x-1 shadow-md">
                  <p>Filter</p>
                  <FunnelIcon className="fill-black w-5 h-5 flex" aria-hidden="true" />
                </Listbox.Button>
                
                <Listbox.Options className="overflow-auto shadow-lg bg-white">
                  {filters.map((filter) => (
                    <Listbox.Option 
                      key={filter} 
                      value={filter}
                      className={({ active }) =>
                        `relative select-none py-2 px-2 ${
                        active ? 'bg-pink-400 text-white' : 'text-black'
                        }`
                      } >
              
                      <div className="flex flex-row">
                      {filteredCategory.includes(filter) ? (
                        <span className="text-black">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        ) : null}
                        <span
                          className={`block truncate ${
                            filteredCategory.includes(filter) ? 'font-medium' : 'font-normal'
                          }`}
                        >
                        {filter}
                        </span>
                      </div>      
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
            </div>
            {/*  sort button */}
            <div className="flex flex-col"> 
              <Listbox value={sort} onChange={setSort} >
                <Listbox.Button className="bg-white rounded-3xl p-2 border border-black flex items-center space-x-1 shadow-md">
                  <p>Sort</p>
                  <ArrowsUpDownIcon className="fill-black w-5 h-5 flex" aria-hidden="true" />
                </Listbox.Button>
                
                <Listbox.Options className="overflow-auto shadow-lg bg-white">
                  {sorts.map((s) => (
                    <Listbox.Option 
                      key={s} 
                      value={s}
                      className={({ active }) =>
                        `relative select-none py-2 px-2 ${
                        active ? 'bg-pink-400 text-white' : 'text-black'
                        }`
                      } >
              
                      <div className="flex flex-row">
                      {sort.includes(s) ? (
                        <span className="text-black">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        ) : null}
                        <span
                          className={`block truncate ${
                            sort.includes(s) ? 'font-medium' : 'font-normal'
                          }`}
                        >
                        {s}
                        </span>
                      </div>      
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
            </div>
          </div>
        </div>   
      </section>
      <div className="flex flex-row">
        <img src={imagePerson} alt="asthetics" className="w-15 h-40 -translate-y-20 -m-2"/>
        {/* List of all events */}
        <div>
          {filteredEvents.map((event, key) => (
            <div key={key} className="flex md:flex-row flex-col ml-5 my-5 lg:mr-20 mr-5 border border-black">
              <img src={event.image_url} alt="event" className="lg:w-1/5 md:w-1/3 object-fill" />
              <div className="m-5 space-y-5">
                <h1 className="text-2xl font-bold text-center">{event.title}</h1>
                <div className="flex md:flex-row flex-col space-x-8">
                  <p className="md:w-1/2 mx-5">{event.description}</p>
                  <div className="md:w-1/2 space-y-2">
                    <div className="flex flex-row space-x-3">
                      <img src={imageCalender} alt="calender icon" className="w-5 h-5" />
                      <div>
                        <p>{event.date[0] === event.date[1] ? new Date(event.date[0]).toLocaleDateString() : new Date(event.date[0]).toLocaleDateString() + ' - ' + new Date(event.date[1]).toLocaleDateString()}</p>
                        <p>{event.date[2].replace('+08:00', '')} - {event.date[3].replace('+08:00', '')}</p>
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
                      <p>{new Date(event.signup_by).toLocaleString()}</p>
                    </div>
                    <Link to="#">
                    <button className="bg-pink-400 text-white rounded-lg py-1 lg:px-20 px-10 shadow-md">
                      Sign up
                    </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Events;