import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/navigation/Navbar"
import axios from "axios";
import defaultOrganizationImage from "../../assets/images/organization-icon.png";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import { Tab } from '@headlessui/react'
import { PlusIcon } from "@heroicons/react/24/outline"
import { setCurrentOrganization, setCurrentOrganizationEvents } from "../../actions/organizationActions";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function OrganizationDashboard() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const organizationsReducer = useSelector((state) => state.organizations);
  const organization = organizationsReducer.currentOrganization;
  const organizationEvents = organizationsReducer.currentOrganizationEvents;
  const [upcomingEvents, setUpcomingEvents] = useState(
    organizationEvents.filter(event => moment(`${event.date[0]} ${event.date[2]}`).isAfter(moment()))
  );
  const [pastEvents, setPastEvents] = useState(
    organizationEvents.filter(event => moment(`${event.date[0]} ${event.date[2]}`).isBefore(moment()))
  );
  const [queryUpcomingEvents, setQueryUpcomingEvents] = useState(upcomingEvents);
  const [queryPastEvents, setQueryPastEvents] = useState(pastEvents);
  const [tabs, setTabs] = useState([
    { name: "Upcoming Events", active: true },
    { name: "Past Events", active: false }
  ]);

  const updateTab = (name) => {
    return () => {
      const newTabs = tabs.map((tab) => {
        if (tab.name === name) {
          return { ...tab, active: true };
        } else {
          return { ...tab, active: false };
        }
      });
      if (name === "Upcoming Events") {
        setUpcomingEvents(organizationEvents.filter(event => moment(`${event.date[0]} ${event.date[2]}`).isAfter(moment())));
      } else if (name === "Past Events") {
        setPastEvents(organizationEvents.filter(event => moment(`${event.date[0]} ${event.date[2]}`).isBefore(moment())));
      }
      setTabs(newTabs);
    };
  };

  useEffect(() => {
    const getOrganization = async () => {
      try {
        const organizationURL = new URL(`/organizations/${id}`, process.env.REACT_APP_BACKEND_API);
        const res = await axios.get(organizationURL);
        const organization = res.data;
        dispatch(setCurrentOrganization(organization));
      } catch (err) {
        console.log(err);
      }
    };
    const getOrganizationEvents = async () => {
      try {
        const organizationEventsURL = new URL(`/events?organization_id=${id}`, process.env.REACT_APP_BACKEND_API);
        const res = await axios.get(organizationEventsURL);
        const organizationEvents = res.data;
        dispatch(setCurrentOrganizationEvents(organizationEvents));
      } catch (err) {
        console.log(err);
      }
    };
    getOrganization();
    getOrganizationEvents();
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="bg-pink-300 py-2 min-h-screen h-full">
        {/* Organizational Profile */}
        <div className="bg-neutral-100 rounded-lg shadow-lg px-10 py-6 m-10 w-screen lg:w-3/4 block mx-auto">
          <div className="flex flex-row items-center justify-between pb-6">
            <div className="flex flex-col me-4">
              <div className="flex flex-row items-center">
                <div className="flex flex-col">
                  <img src={organization.image_url || defaultOrganizationImage} alt="organization-image" className="w-24 h-24 rounded-full" />
                </div>
                <div className="flex flex-col items-center">
                  <h1 className="mx-3 font-semibold my-2 ps-4 text-xl lg:text-3xl">{organization.name}</h1>
                </div>
              </div>
            </div>
            {/* Edit Organizational Profile */}
            <div className="flex flex-col items-center">
              <Link to={`/organizations/${organization._id}/edit`} className="bg-primary-600 hover:bg-primary-800 text-white py-2 px-4 rounded-lg mr-0 text-sm lg:text-base">
                Edit Profile
              </Link>
            </div>
          </div>
          <div className="flex flex-row">
            <p className="font-light text-sm md:text-base text-justify">{organization.description}</p>
          </div>
        </div>
        {/* Tab for events */}
        <div className="w-screen lg:w-3/4 block mx-auto">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-lg bg-neutral-100 p-1">
              {tabs.map((tab) => (
                <Tab key={tab.name} className={classNames(tab.active ? 'bg-white-shadow bg-primary-600 text-white' : 'hover:bg-white/[0.12] hover:text-primary-600',
                  'w-full rounded-lg py-2.5 text-sm md:text-base font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2')} onClick={updateTab(tab.name)} >
                  {tab.name}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel className="rounded-lg bg-neutral-100 p-3 ring-white ring-opacity-60 ring-offset-blue-400 focus:outline-none focus:ring-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 py-3">
                  <div className="flex flex-col col-span-1">
                    <h1 className="text-lg lg:text-xl font-bold">Upcoming Events</h1>
                  </div>
                  <div className="flex flex-col col-span-1">
                    <form className="mr-auto md:mr-0 md:ml-auto">
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                          <div className="p-1">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 object-contain" aria-hidden="true" />
                          </div>
                        </span>
                        <input
                          type="text"
                          placeholder="Search Upcoming Events"
                          className="h-10 pl-10 w-80 xl:w-96 placeholder-gray-500 border rounded-lg focus:shadow-outline text-sm lg:text-base"
                          onChange={(e) => {
                            const keyword = e.target.value;
                            const results = keyword ? upcomingEvents.filter(event => event.title.toLowerCase().includes(keyword.toLowerCase())) : upcomingEvents;
                            setQueryUpcomingEvents(results);
                          }}
                        />
                      </div>
                    </form>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Event Name</th>
                        <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Start Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">End Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {
                        queryUpcomingEvents.length === 0 ? (
                          <tr>
                            <td className="px-6 py-4 text-sm md:text-base text-neutral-600" colSpan="4">No upcoming events</td>
                          </tr>
                        ) : (queryUpcomingEvents.map((event) => (
                          <tr key={event._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">{event.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">{moment(`${event.date[0]} ${event.date[2]}`).format('Do MMMM YYYY, h:mm A')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">{moment(`${event.date[1]} ${event.date[3]}`).format('Do MMMM YYYY, h:mm A')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">
                              <Link to={`/events/${event._id}/edit`} className="text-primary-600 hover:text-primary-800">
                                Edit
                              </Link>
                              <span className="px-2">|</span>
                              <button type="button" className="text-primary-600 hover:text-primary-800">
                                Delete
                              </button>
                            </td>
                          </tr>
                        )))
                      }
                    </tbody>
                  </table>
                </div>
                {/* Floating Action Button */}
                <div className="bottom-0 right-0 my-2 mr-4 px-3">
                  <Link to="/events/create" className="flex items-center w-14 h-14 rounded-full bg-primary-600 hover:bg-primary-800 text-white ml-auto">
                    <PlusIcon className="h-7 w-7 text-white mx-auto block" aria-hidden="true" />
                  </Link>
                </div>
              </Tab.Panel>
              <Tab.Panel className="rounded-lg bg-neutral-100 p-3 ring-white ring-opacity-60 ring-offset-blue-400 focus:outline-none focus:ring-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 py-3">
                  <div className="flex flex-col col-span-1">
                    <h1 className="text-lg lg:text-xl font-bold">Past Events</h1>
                  </div>
                  <div className="flex flex-col col-span-1">
                    <form className="mr-auto md:mr-0 md:ml-auto">
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                          <div className="p-1">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 object-contain" aria-hidden="true" />
                          </div>
                        </span>
                        <input
                          type="text"
                          placeholder="Search Past Events"
                          className="h-10 pl-10 w-80 xl:w-96 placeholder-gray-500 border rounded-lg focus:shadow-outline"
                          onChange={(e) => {
                            const keyword = e.target.value;
                            const results = keyword ? pastEvents.filter(event => event.title.toLowerCase().includes(keyword.toLowerCase())) : pastEvents;
                            setQueryPastEvents(results);
                          }}
                        />
                      </div>
                    </form>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Event Name</th>
                        <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Start Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">End Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {
                        queryPastEvents.length === 0 ? (
                          <tr>
                            <td className="px-6 py-4 text-sm md:text-base text-neutral-600" colSpan="4">No past events</td>
                          </tr>
                        ) : (queryPastEvents.map((event) => (
                          <tr key={event._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">{event.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">{moment(`${event.date[0]} ${event.date[2]}`).format('MMMM Do YYYY, h:mm a')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">{moment(`${event.date[1]} ${event.date[3]}`).format('MMMM Do YYYY, h:mm a')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">
                              <Link to={`/events/${event._id}/edit`} className="text-primary-600 hover:text-primary-800">
                                Edit
                              </Link>
                              <span className="px-2">|</span>
                              <button type="button" className="text-primary-600 hover:text-primary-800">
                                Delete
                              </button>
                            </td>
                          </tr>
                        )))
                      }
                    </tbody>
                  </table>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </>
  )
}

export default OrganizationDashboard;