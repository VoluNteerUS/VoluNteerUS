import React, { useEffect, useState } from "react";
import imagePeople from "../assets/images/people.png";
import imageJoinUs from "../assets/images/image-join-us.png"
import imageExploreEvents from "../assets/images/image-explore-events.png"
import imageTrackInvolvement from "../assets/images/image-track-involvement.png"
import imageCalender from "../assets/images/calender-icon.png";
import imageLocation from "../assets/images/location-icon.png"; 
// temporary image for organizations
import imageOrganization from "../assets/images/organization-icon.png";
// temporary image for events
import imageEvent from "../assets/images/event-icon.png"
import axios from "axios";

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
            link: "#",
            title: "Explore Events",
            description: "Discover volunteering events on campus or in your neighbourhood"
        },
        {
            img: imageTrackInvolvement,
            link: "#",
            title: "Track Involvement",
            description: "Record your activities to showcase your involvment"
        }
    ];

    const [allEvents, setAllEvents] = useState([]);

    useEffect(() => {
        getAllEvents();
    }, []);

    const getAllEvents= () => {
        axios.get('http://localhost:5000/events')
            .then((res) => {
                const events = res.data;
                setAllEvents(events);
            })
            .catch(err => console.error({err}));
    }

    const featuredEvents = allEvents.length > 4 ? allEvents.slice(0, 4) : allEvents;

    return (
        <>
            <section className="bg-pink-100">
                <img src={imagePeople} alt="asthetic" className="mx-auto max-w-xs py-10"/>
            </section>
            <div className="grid gap-4 lg:grid-cols-3 -translate-y-14 lg:mx-60">
                {navigations.map((items, key) => (
                    <a href={items.link} className={`bg-grey-100 py-5 rounded-lg`} key={key}>
                        <img src={items.img} alt="asthetic" className="mx-auto rounded-full w-16 bg-grey-500"/>
                        <h4 className="font-semibold text-lg text-center">{items.title}</h4>
                        <hr className="h-1 mb-4 border-0 bg-pink-500 w-40 mx-auto"/>
                        <p className="text-sm text-center mx-2">{items.description}</p>
                    </a>
                ))}
            </div>
            <div>
                <p className="text-xl mx-20 font-bold">Featured Events</p>
                <div className="grid gap-4 md:grid-cols-4 grid-cols-2 lg:mx-20 md:mx-10 mx-20 my-5">
                    {featuredEvents.map((event, key) => (
                        <a href='#' className="border border-black" key={key}>
                            <img src={imageEvent} alt="event-image" className="flex backdrop-invert" />
                            <p className="mx-3 font-semibold my-2">{event.title}</p>
                            <div className="flex flex-row space-x-2 mx-3">
                                <img src={imageCalender} alt="calender icon" className="w-5 h-5"/>
                                    <p>{event.date[0] == event.date[1] ? event.date[0] : event.date[0] + ' to ' + event.date[1]}</p>
                            </div>
                            <div className="flex flex-row space-x-2 mx-3">
                                <img src={imageLocation} alt="location icon" className="w-5 h-5"/>
                                <p>{event.location.length <= 20 ? event.location : event.location.substring(0, 20) + '...'}</p>
                            </div>
                            <div className="flex flex-row space-x-2 mx-3">
                                <img src={imageOrganization} alt="organization icon" className="w-5 h-5"/>
                                <p>{event.organized_by.length <= 20 ? event.organized_by : event.organized_by.substring(0, 20) + '...'}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Home;
