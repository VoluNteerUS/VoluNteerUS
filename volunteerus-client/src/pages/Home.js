import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import imagePeople from "../assets/images/people.png";
import imageJoinUs from "../assets/images/image-join-us.png"
import imageExploreEvents from "../assets/images/image-explore-events.png"
import imageTrackInvolvement from "../assets/images/image-track-involvement.png"
import imageCalender from "../assets/images/calender-icon.png";
import imageLocation from "../assets/images/location-icon.png";
// temporary image for organizations
import imageOrganization from "../assets/images/organization-icon.png";
import { Link } from "react-router-dom";
import { TagIcon } from "@heroicons/react/24/solid";
import { api } from "../services/api-service";

function Home() {
    const navigations = [
        {
            img: imageJoinUs,
            link: "/register",
            title: "Join Us!",
            description: "Become a volunteer and contribute back to the community"
        },
        {
            img: imageExploreEvents,
            link: "/events",
            title: "Explore Events",
            description: "Discover volunteering events on campus or in your neighbourhood"
        },
        {
            img: imageTrackInvolvement,
            link: "/login",
            title: "Track Involvement",
            description: "Record your activities to showcase your involvment"
        }
    ];
    
    const search = "";
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

    const [featuredEvents, setFeaturedEvents] = useState([]);

    useEffect(() => {
        const getAllEvents = () => {
            api.getUpcomingEvents(1, 4, search, filters).then((res) => {
                const events = res.data.result;
                setFeaturedEvents(events);
            }).catch(err => console.error({ err }));
        }

        getAllEvents();
    }, []);

    const { user } = useSelector((state) => state.user);

    // Redirect to admin dashboard if user is admin
    if (user?.role === "ADMIN") {
        return <Navigate to="/admin" replace />;
    } else if (localStorage.getItem("token")) {
        return <Navigate to="/dashboard" replace />;
    } else {
        return (
        <>
            <section className="bg-pink-100">
                <img src={imagePeople} alt="asthetic" className="mx-auto max-w-xs py-10" />
            </section>
            <div className="grid gap-4 lg:grid-cols-3 -translate-y-14 lg:mx-60">
                {navigations.map((items, key) => (
                    <a href={items.link} className={`bg-grey-100 py-5 rounded-lg`} key={key}>
                        <img src={items.img} alt="asthetic" className="mx-auto rounded-full w-16 bg-grey-500" />
                        <h4 className="font-semibold text-lg text-center">{items.title}</h4>
                        <hr className="h-1 mb-4 border-0 bg-pink-500 w-40 mx-auto" />
                        <p className="text-sm text-center mx-2">{items.description}</p>
                    </a>
                ))}
            </div>
            <div>
                <p className="text-xl mx-5 md:mx-10 lg:mx-20 font-bold">Featured Events</p>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-5 md:mx-10 lg:mx-20 my-5">
                    {featuredEvents.map((event, key) => (
                        <Link to='/events' state={event} className="border border-black col-span-1" key={key}>
                            <img src={event.image_url} alt="event" className="h-60 md:h-72 xl:h-80 w-full object-cover" />
                            <div className="p-3">
                                <p className="font-semibold my-2">{event.title}</p>
                                <div className="flex flex-row space-x-2">
                                    <img src={imageCalender} alt="calender icon" className="w-5 h-5" />
                                    <p>{event.date[0] === event.date[1] ? event.date[0] : event.date[0] + ' to ' + event.date[1]}</p>
                                </div>
                                <div className="flex flex-row space-x-2">
                                    <img src={imageLocation} alt="location icon" className="w-5 h-5" />
                                    <p>{event.location.length <= 20 ? event.location : event.location.substring(0, 20) + '...'}</p>
                                </div>
                                <div className="flex flex-row space-x-2">
                                    <img src={imageOrganization} alt="organization icon" className="w-5 h-5" />
                                    <p>{event.organized_by["name"].length <= 30 ? event.organized_by["name"] : event.organized_by["name"].substring(0, 30) + '...'}</p>
                                </div>
                                <div className="flex flex-row space-x-2">
                                    <TagIcon className="w-5 h-5" />
                                    <div className="flex flex-row flex-wrap gap-2">
                                    {
                                        event.category.map((tag, key) => (
                                            <span className="bg-primary-600 text-white text-sm px-3 rounded-full" key={key}>{tag}</span>
                                        ))
                                    }
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
        );
    }
}

export default Home;