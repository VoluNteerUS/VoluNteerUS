import React from 'react';
import { Link } from 'react-router-dom';
import CalendarIcon from '../assets/images/calender-icon.png';
import LocationIcon from '../assets/images/location-icon.png';
import moment from 'moment';
import { TagIcon } from '@heroicons/react/24/solid';

function EventCard({event}) {
    return (
        <div className="bg-grey-100 rounded-lg shadow-lg">
            <Link to={`/events/${event._id}`} key={event._id}>
                <div className="flex flex-col">
                    <img src={event.image_url} className="rounded-t-lg h-64 object-cover" />
                    <div className="mx-3 my-2">
                        <h3 className="font-semibold text-md lg:text-lg">
                            { event.title.length > 20 ? event.title.substring(0, 25) + '...' : event.title }
                        </h3>
                        <div className="flex items-center">
                            <img src={CalendarIcon} alt="calendar-icon" className="h-5 w-5 inline-block me-2" />
                            {new moment(`${event.date[0]} ${event.date[2]}`).format('Do MMM YYYY, h:mm A')}
                        </div>
                        <div className="flex items-center">
                            <img src={LocationIcon} alt="calendar-icon" className="h-5 w-5 inline-block me-2" />
                            { event.location.length > 20 ? event.location.substring(0, 20) + '...' : event.location }
                        </div>
                        <div className="flex items-center">
                            <TagIcon className="h-5 w-5 inline-block me-2" />
                            <div className="flex flex-row flex-wrap gap-2">
                            {
                                event.category.map((tag, key) => (
                                    <span className="bg-primary-600 text-white text-sm px-3 rounded-full" key={key}>{tag}</span>
                                ))
                            }
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default EventCard;