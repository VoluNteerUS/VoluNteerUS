import React, { useEffect, useState } from "react";
import Navbar from "../../components/navigation/Navbar";
import axios from "axios";
import { Link } from "react-router-dom";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useDispatch, useSelector } from "react-redux";
import { setOrganizations } from "../../actions/organizationActions";

function OrganizationsPage() {
    const dispatch = useDispatch();
    const organizationsReducer = useSelector((state) => state.organizations);
    const organizations = organizationsReducer.organizations;
    const [queryOrganizations, setQueryOrganizations] = useState(organizations);

    useEffect(() => {
        const getOrganizations = async () => {
            try {
                const organizationsURL = new URL('/organizations', process.env.REACT_APP_BACKEND_API);
                const res = await axios.get(organizationsURL);
                const organizations = res.data;
                dispatch(setOrganizations(organizations));
            } catch (err) {
                console.error({ err });
            }
        }
        getOrganizations();
    }, []);

    return (
        <>
            <Navbar />
            <div className="block mx-auto w-screen pt-4 lg:w-3/4 lg:pt-8">
                <h1 className="text-3xl font-bold">Organizations</h1>
                {/* Search Bar */}
                <div className="mt-4">
                    <form method="GET">
                        <div className="grid grid-cols-2">
                            <div className="relative col-span-1">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                    <div className="p-1">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 object-contain" aria-hidden="true" />
                                    </div>
                                </span>
                                <input 
                                    type="text" 
                                    placeholder="Search Organizations" 
                                    className="h-10 px-3 pl-10 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline w-4/5"
                                    onChange={(e) => {
                                        const searchQuery = e.target.value;
                                        const filteredOrganizations = searchQuery 
                                            ? organizations.filter((organization) => {
                                                return organization.name.toLowerCase().includes(searchQuery.toLowerCase());
                                            }) : organizations;
                                        setQueryOrganizations(filteredOrganizations);
                                    }}
                                />
                            </div>
                            {/* Sort By */}
                            <div className="col-span-1">
                                <span className="text-sm pe-3">Sort by</span>
                                <select id="sort-by" name="sort-by" className="h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline">
                                    <option value="name">Name</option>
                                    <option value="date">Category</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 pt-4">
                    {/* Organization Card */}
                    {queryOrganizations.map((organization) => (
                        <div className="bg-grey-100 rounded-lg shadow-lg">
                            <Link to={`/organizations/${organization._id}`} key={organization._id}>
                                <div className="flex flex-col justify-center items-center">
                                    <div className="pt-4">
                                        <img src={organization.image_url} alt="organization-image" className="w-28 h-28 rounded-full" />
                                    </div>
                                    <h3 className="mx-3 font-semibold my-2 text-md lg:text-lg">{organization.name}</h3>
                                    <div className="flex flex-row space-x-2 mx-3 text-sm text-justify">
                                        {organization.description.length <= 160 ? organization.description : organization.description.substring(0, 160) + '...'}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default OrganizationsPage;