import Navbar from "../../components/navigation/Navbar";
import { useParams } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Tab } from "@headlessui/react";

function EventDetails() {
    const { id } = useParams();
    const [event, setEvent] = useState({});

    const getEvent = async () => {
        try {
            const eventURL = new URL(`/events/${id}`, process.env.REACT_APP_BACKEND_API);
            await axios.get(eventURL).then((res) => {
                console.log(res.data);
                setEvent(res.data);
            });
        } catch (err) {
            console.error({ err });
        }
    }

    useEffect(() => {
        getEvent();
    }, []);

    return (
        <div className="h-screen">
            <Navbar />
            <div className="block mx-auto px-3 lg:w-3/4 lg:px-0 py-3">
                {/* Event title */}
                <div className="font-bold text-2xl md:text-3xl lg:text-4xl py-4">{ event?.title }</div>
                {/* Event organizer */}
                <div className="flex flex-row items-center gap-2">
                    <div className="font-semibold">
                        <img className="w-10 h-10 rounded-full" src={ event?.organized_by?.image_url } alt="Profile picture" />
                    </div>
                    <div className="font-bold">{ event?.organized_by?.name }</div>
                </div>
                {/* Event Poster */}
                <div className="flex flex-col items-center justify-center">
                    <img className="w-auto h-96" src={ event?.image_url } alt="Event poster" />
                </div>
                {/* Tab */}
                <div className="py-4">
                    <Tab.Group>
                        <Tab.List className="flex p-1 space-x-1 bg-neutral-500/20 rounded-xl">
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button className={`w-full py-2.5 text-sm leading-5 font-medium text-white rounded-lg ${selected ? "bg-primary-600" : "bg-transparent"}`}>
                                        Event Information
                                    </button>
                                )}
                            </Tab>
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button className={`w-full py-2.5 text-sm leading-5 font-medium text-white rounded-lg ${selected ? "bg-primary-600" : "bg-transparent"}`}>
                                        Grouping
                                    </button>
                                )}
                            </Tab>
                        </Tab.List>
                        <Tab.Panels className="mt-2">
                            <Tab.Panel className="bg-white rounded-xl p-3">
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-row items-center gap-2">
                                        {
                                            event?.date ? (
                                                <>
                                                    <div className="font-semibold">Date:</div>
                                                    <div>{ moment(`${event?.date[0]} ${event?.date[2]}`).format('Do MMM YYYY h:mm A') }</div> to <div>{ moment(`${event?.date[1]} ${event?.date[3]}`).format('Do MMM YYYY h:mm A') }</div>
                                                </>
                                            ) : null

                                        }
                                    </div>
                                    <div className="flex flex-row items-center gap-2">
                                        <div className="font-semibold">Location:</div>
                                        <div>{ event?.location }</div>
                                    </div>
                                    <div className="flex flex-row items-center gap-2">
                                        <div className="font-semibold">Category:</div>
                                        <div className="flex flex-row flex-wrap gap-2">
                                        {
                                            event?.category?.map((tag, key) => (
                                                <span className="bg-primary-600 text-white text-sm px-3 rounded-full" key={key}>{tag}</span>
                                            ))
                                        }
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center gap-2">
                                        <div className="font-semibold">Description:</div>
                                        <div>{ event?.description }</div>
                                    </div>
                                </div>
                            </Tab.Panel>
                            <Tab.Panel className="bg-white rounded-xl">
                                <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 bg-grey-100 rounded-lg p-6 mt-3">
                                    {
                                        event?.groups?.length > 0 ? event?.groups?.map((group, index) => (
                                            <div className="bg-white rounded p-3">
                                                <h3 className="font-bold text-neutral-700 text-lg">Group { group.number }</h3>
                                                {
                                                group?.members.map((member) => {
                                                    if (member !== null) {
                                                    return (
                                                        <div className="flex flex-row bg-neutral-100 rounded p-2 my-2">
                                                        <img 
                                                            className="h-12 w-12 rounded-full me-4" 
                                                            src={ member?.profile_picture === "" ? `https://ui-avatars.com/api/?name=${member?.full_name}&background=0D8ABC&color=fff` : member?.profile_picture } alt="Profile Picture" />
                                                        <p className="flex items-center">{ member?.full_name }</p>
                                                        </div>
                                                    )
                                                    }
                                                })
                                                }
                                            </div>
                                        )) : <div className="font-semibold">No grouping yet</div>
                                    }
                                </div>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>
        </div>
    )
}

export default EventDetails;