import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentOrganization } from "../../actions/organizationActions";
import defaultOrganizationImage from "../../assets/images/organization-icon.png";
import emailIcon from "../../assets/social_media_icons/email.ico"
import facebookIcon from "../../assets/social_media_icons/facebook.ico"
import instagramIcon from "../../assets/social_media_icons/instagram.ico"
import linkedinIcon from "../../assets/social_media_icons/linkedin.ico"
import twitterIcon from "../../assets/social_media_icons/twitter.ico"
import websiteIcon from "../../assets/social_media_icons/website.ico"
import youtubeIcon from "../../assets/social_media_icons/youtube.ico"
import EventCard from "../../components/EventCard";
import { api } from "../../services/api-service";

function OrganizationDetailsPage(){
    const { id } = useParams();
    const dispatch = useDispatch();
    const [organization, setOrganization] = useState(null);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    const getIconFor = (platform) => {
        switch (platform) {
            case 'Facebook':
                return facebookIcon;
            case 'Instagram':
                return instagramIcon;
            case 'Twitter':
                return twitterIcon;
            case 'LinkedIn':
                return linkedinIcon;
            case 'YouTube':
                return youtubeIcon;
            case 'Website':
                return websiteIcon;
            default:
                return websiteIcon;
        }
    }

    const getOrganization = async () => {
        try {
            const organization = await api.getOrganization(id).then(res => res.data);
            setOrganization(organization);
            dispatch(setCurrentOrganization(organization));
        } catch (err) {
            console.error({ err });
        }
    }

    const getEventsByOrganization = async () => {
        try {
            const res = await api.getUpcomingEventsByOrganization(id);
            const paginatedEvents = { ...res.data };
            setUpcomingEvents(paginatedEvents.result);
        } catch (err) {
            console.error({ err });
        }
    }

    useEffect(() => {
        getOrganization();
        getEventsByOrganization();
    }, []);

    return(
        <>
            {/* Organization Details */}
            <div className="block mx-auto w-screen pt-4 lg:w-3/4 lg:pt-8">
                <div className="flex items-center">
                    <div className="me-4">
                        <img src={organization?.image_url || defaultOrganizationImage} alt="organization-image" className="w-24 h-24 rounded-full" />
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="mx-3 font-semibold my-2 text-xl lg:text-3xl">{organization?.name}</p>
                    </div>
                </div>
                <div className="grid grid-cols-4 my-2 pb-12">
                    <div className="col-span-3">
                        <p className="me-16 font-light text-md lg:text-lg text-justify">{organization?.description}</p>
                    </div>
                    <div className="col-span-1">
                        <div className="bg-pink-500 px-4 py-2">
                            <h3 className="text-2xl font-serif font-bold text-white">Contact Information</h3>
                            {/* Email */}
                            <div className="flex flex-row items-center text-white">
                                <img src={emailIcon} alt="email-icon" className="h-6 w-6 me-2 text-white" />
                                <Link className="hover:text-neutral-200" to={`mailto:${organization?.contact?.email}`}>Email</Link>
                            </div>
                            {
                                organization?.contact?.social_media.map((social_media) => (
                                    <div className="flex flex-row items-center text-white">
                                        <img src={getIconFor(social_media.platform)} alt={`${social_media.platform}-icon`} className="h-6 w-6 me-2 text-white" />
                                        <Link className="hover:text-neutral-200" to={social_media.url}>{ social_media.platform }</Link>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                {/* Upcoming Events */}
                <h3 className="text-2xl font-bold text-black">Upcoming Events</h3>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-4 pb-4">
                    { upcomingEvents?.length > 0 ? upcomingEvents?.map((event) => (
                        <EventCard event={event} />
                    )): (
                    <p className="text-lg font-medium text-neutral-700">No upcoming events</p>
                    )}
                </div>          
            </div>
        </>
    )
}

export default OrganizationDetailsPage;