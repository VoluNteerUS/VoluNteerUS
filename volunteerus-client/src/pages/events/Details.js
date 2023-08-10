import { useParams } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import moment from "moment";
import { Tab } from "@headlessui/react";
import { Link } from "react-router-dom";
import { api } from "../../services/api-service";

const Details = ({ event }) => {
    return (
        <>
            {/* Event Poster */}
            <div className="flex items-center justify-center sm:pt-6">
                <img className="w-auto h-80" src={event?.image_url} alt="Event poster" />
            </div>
            <div class="mx-auto max-w-2xl px-4 pb-6 pt-6 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-10 lg:pt-10">
                <div class="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                    <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{event?.title}</h1>
                </div>

                <div class="mt-4 lg:row-span-3 lg:mt-0">
                    <h2 class="sr-only">Event information</h2>
                    <p class="text-lg sm:text-2xl xl:text-3xl tracking-tight text-gray-900">
                        {
                            event?.date ? (
                                <span>{moment(`${event?.date[0]} ${event?.date[2]}`).format('Do MMMM YYYY h:mm A')}</span>
                            ) : null
                        }
                    </p>

                    <div class="mt-6">
                        <h3 class="sr-only">Organization</h3>
                        <div class="flex items-center">
                            {/* Event organizer */}
                            <div className="font-semibold">
                                <img className="w-10 h-10 rounded-full" src={event?.organized_by?.image_url} alt="Profile picture" />
                            </div>
                            <div className="ml-3 text-base font-medium">{event?.organized_by?.name}</div>
                        </div>
                    </div>

                    <div class="mt-10">
                        <div>
                            <h3 class="text-sm md:text-base font-medium text-gray-900">Categories</h3>
                            <div className="flex flex-row flex-wrap gap-2 mt-2">
                                {
                                    event?.category?.map((tag, key) => (
                                        <Link to="/events" state={{ category:tag }} className="bg-primary-600 text-white px-3 rounded-full" key={key}>{tag}</Link>
                                    ))
                                }
                            </div>
                        </div>

                        <div class="mt-10">
                            <h3 class="text-sm md:text-base font-medium text-gray-900">Sign Up By</h3>
                            <div class="mt-2">
                                <div class="text-gray-600">{moment(`${event?.signup_by}`).format('Do MMMM YYYY h:mm A')}</div>
                            </div>
                        </div>

                        <div className="mt-10">
                            <Link className="flex w-full items-center justify-center rounded-md border border-transparent bg-primary-600 px-8 py-3 text-base font-medium text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2" to={`/events/${event?._id}/signup`}>Sign up</Link>
                        </div>
                    </div>
                </div>

                <div class="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
                    <Tab.Group>
                        <Tab.List className="flex p-1 space-x-1 bg-neutral-500/20 rounded-xl">
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button className={`w-full py-2.5 text-sm leading-5 font-medium rounded-lg ${selected ? "bg-primary-600 text-white" : "bg-transparent"}`}>
                                        Event Information
                                    </button>
                                )}
                            </Tab>
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button className={`w-full py-2.5 text-sm leading-5 font-medium rounded-lg ${selected ? "bg-primary-600 text-white" : "bg-transparent"}`}>
                                        Grouping
                                    </button>
                                )}
                            </Tab>
                        </Tab.List>
                        <Tab.Panels className="mt-2">
                            <Tab.Panel className="bg-grey-100 rounded-lg p-6 mt-3">
                                <div>
                                    <h3 class="sr-only">Description</h3>

                                    <div class="space-y-6">
                                        <p class="text-base text-gray-900">
                                            {event?.description}
                                        </p>
                                    </div>
                                </div>

                                <div class="mt-6">
                                    <h3 class="font-medium text-gray-900">Location</h3>
                                    <div class="mt-2">
                                        <div class="text-gray-600">{event?.location}</div>
                                    </div>
                                </div>

                                {
                                    event?.date ? (
                                        <div class="mt-6">
                                            <h3 class="font-medium text-gray-900">Duration</h3>
                                            <div class="mt-2">
                                                <div class="text-gray-600">
                                                    {moment(`${event?.date[0]} ${event?.date[2]}`).format('Do MMMM YYYY h:mm A')} to {moment(`${event?.date[1]} ${event?.date[3]}`).format('Do MMMM YYYY h:mm A')}
                                                </div>
                                            </div>
                                        </div>
                                    ) : null
                                }
                            </Tab.Panel>
                            <Tab.Panel className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols gap-4 bg-grey-100 rounded-lg p-6 mt-3">
                                {
                                    event?.groups?.length > 0 ? event?.groups?.map((group, index) => (
                                        <div className="bg-white rounded p-3">
                                            <h3 className="font-bold text-neutral-700 text-lg">Group {group.number}</h3>
                                            {
                                                group?.members.map((member) => {
                                                    if (member !== null) {
                                                        return (
                                                            <div className="flex flex-row bg-neutral-100 rounded p-2 my-2">
                                                                <img
                                                                    className="h-12 w-12 rounded-full me-4"
                                                                    src={member?.profile_picture === "" ? `https://ui-avatars.com/api/?name=${member?.full_name}&background=0D8ABC&color=fff` : member?.profile_picture} alt="Profile Picture" />
                                                                <p className="flex items-center">{member?.full_name}</p>
                                                            </div>
                                                        )
                                                    }
                                                })
                                            }
                                        </div>
                                    )) : <div className="font-semibold">No grouping yet</div>
                                }
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>
        </>
    )
}

function EventDetails() {
    const { id } = useParams();
    const [event, setEvent] = useState({});

    const getEvent = async () => {
        try {
            await api.getEvent(id).then((res) => setEvent(res.data));
        } catch (err) {
            console.error({ err });
        }
    }

    useEffect(() => {
        getEvent();
    }, []);

    return (
        <div className="h-screen">
            <Details event={event} />
        </div>
    )
}

export default EventDetails;