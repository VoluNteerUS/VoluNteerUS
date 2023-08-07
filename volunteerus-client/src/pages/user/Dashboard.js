import { useEffect, useState } from "react"
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import { MapPinIcon } from "@heroicons/react/24/solid";
import EventCard from "../../components/EventCard";
import { api } from "../../services/api-service";


function UserDashboard() {
    const token = localStorage.getItem("token");
    const { user } = useSelector((state) => state.user);
    const [userUpcomingEvents, setUserUpcomingEvents] = useState([])
    const [recommendedEvents, setRecommendedEvents] = useState([])

    const getUserUpcomingEvents = async () => {
        await api.getUserUpcomingEvents(localStorage.getItem("token"), user.id).then(res => {
            setUserUpcomingEvents(res.data)
        });
    }
    
    const getRecommendedEvents = async () => {
        await api.getUserRecommendedEvents(localStorage.getItem("token"), user.id).then(res => {
            console.log(res.data)
            setRecommendedEvents(res.data)
        });
    }

    useEffect(() => {
        getUserUpcomingEvents();
        getRecommendedEvents();
    }, [])

    if (token) {
        return (
            <>
                <div className="block mx-auto lg:w-3/4 p-4 md:p-8">
                    <h1 className="font-bold text-xl md:text-2xl lg:text-3xl py-4">Your Upcoming Events</h1>
                    <div className="flex flex-col">
                        {
                            userUpcomingEvents?.length > 0 ? userUpcomingEvents.map((event) => (
                                <div key={event._id} className="bg-neutral-100 rounded-lg flex flex-row flex-wrap md:flex-nowrap gap-6 my-2 p-4">
                                    <div className="flex flex-col items-center justify-center text-darkblue-900 bg-pink-100 aspect-square h-36">
                                        <div className="font-semibold text-xl uppercase">{ moment(`${event.date[0]} ${event.date[2]}`).format("dddd") }</div>
                                        <div className="font-semibold">{ moment(`${event.date[0]} ${event.date[2]}`).format("Do MMMM YYYY") }</div>
                                        <div className="font-bold font-serif text-3xl">{ moment(`${event.date[0]} ${event.date[2]}`).format("hh:mm A") }</div>
                                    </div>
                                    <div className="flex flex-col lg:basis-2/3">
                                        <div className="font-serif font-bold hover:text-neutral-600 text-2xl md:text-3xl pb-2"><Link to={`/events/${event._id}`}>{ event.title }</Link></div>
                                        <div>{ event.description.length > 400 ? event.description.substring(0, 400) + "..." : event.description }</div>
                                    </div>
                                    <div className="flex flex-col lg:basis-1/4">
                                        <div className="flex flex-row font-semibold">
                                            <MapPinIcon className="w-6 h-6 me-2 text-grey-800"/>
                                            <span>{ event.location }</span>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="bg-neutral-200 rounded-lg flex flex-col items-center justify-center h-40">
                                    <span className="font-semibold text-2xl">No upcoming events!</span>
                                    <Link to="/events" className="text-lg text-blue-600 hover:text-blue-800 py-2">
                                        Browse events to sign up!
                                    </Link>
                                </div>
                            )
                        }
                    </div>
                    {/* Maximum of 8 recommended events shown */}
                    <h1 className="font-bold text-xl md:text-2xl lg:text-3xl py-4">Recommended For You</h1>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {
                            recommendedEvents.length > 8 ? recommendedEvents.slice(0, 8).map((event) => (
                                <EventCard key={event._id} event={event} />
                            )) : recommendedEvents.map((event) => (
                                <EventCard key={event._id} event={event} />
                            ))
                        }
                    </div>
                </div>
            </>
        )
    } else {
        return <Navigate to="/login" replace />
    }
}

export default UserDashboard