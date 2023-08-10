import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowsUpDownIcon, CheckIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useDispatch } from "react-redux";
import { setOrganizations } from "../../actions/organizationActions";
import defaultOrganizationImage from "../../assets/images/organization-icon.png";
import Pagination from "../../components/navigation/Pagination";
import { Listbox } from '@headlessui/react'
import { api } from "../../services/api-service";

function OrganizationsPage() {
    const dispatch = useDispatch();

    const sorts = [
        "A to Z",
        "Z to A",
    ]

    const [state, setState] = useState({
        searchQuery: '',
        organizations: [],
        currentPage: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 0,
    });
    const [selectedSort, setSelectedSort] = useState(sorts[0]);

    useEffect(() => {
        const getOrganizations = async () => {
            try {
                let sortBy = "ASC";
                switch (selectedSort) {
                  case "Z to A":
                    sortBy = "DESC"
                    break;
                  default:
                    sortBy = "ASC"
                    break;
                }
                const res = await api.getAllOrganizations(state.searchQuery, state.currentPage, state.limit, sortBy);
                const paginatedOrganizations = { ...res.data };
                dispatch(setOrganizations(paginatedOrganizations.result));
                setState({
                    ...state,
                    organizations: paginatedOrganizations.result,
                    totalItems: paginatedOrganizations.totalItems,
                    totalPages: paginatedOrganizations.totalPages
                });
            } catch (err) {
                console.error({ err });
            }
        }
        getOrganizations();
    }, [state.searchQuery, selectedSort, state.currentPage]);

    const handlePageChange = (page) => {
        setState({ ...state, currentPage: page });
    }

    const handleNextPage = () => {
        setState({ ...state, currentPage: state.currentPage + 1 });
    }

    const handlePrevPage = () => {
        setState({ ...state, currentPage: state.currentPage - 1 });
    }

    return (
        <>
            <div className="block mx-auto w-screen pt-4 px-3 lg:px-0 lg:w-3/4 lg:pt-8">
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
                                    onChange={(e) => setState({ ...state, searchQuery: e.target.value })}
                                />
                            </div>
                            {/* Sort By */}
                            <div className="col-span-1">
                                {/* Sort Button */}
                                <Listbox value={selectedSort} onChange={setSelectedSort}>
                                    <div className="relative w-32">
                                    <Listbox.Button className="relative h-10 w-full py-2 pl-3 pr-10 text-left bg-white placeholder-gray-600 border rounded-lg cursor-default focus:shadow-outline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75 sm:text-sm">
                                        <span className="block truncate">{selectedSort}</span>
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                        <ArrowsUpDownIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                                        </span>
                                    </Listbox.Button>
                                    <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-20">
                                        {sorts.map((sort, sortIdx) => (
                                        <Listbox.Option
                                            key={sortIdx}
                                            className={({ active }) =>
                                            `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'}
                                            cursor-default select-none relative py-2 pl-10 pr-4`
                                            }
                                            value={sort}
                                        >
                                            {({ selected, active }) => (
                                            <>
                                                <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                                                {sort}
                                                </span>
                                                {selected ? (
                                                <span
                                                    className={`${active ? 'text-amber-600' : 'text-amber-600'}
                                                absolute inset-y-0 left-0 flex items-center pl-3`}
                                                >
                                                    <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                                </span>
                                                ) : null}
                                            </>
                                            )}
                                        </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                    </div>
                                </Listbox>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 pt-4">
                    {/* Organization Card */}
                    {state.organizations.map((organization) => (
                        <div className="bg-grey-100 rounded-lg shadow-lg" key={organization._id}>
                            <Link to={`/organizations/${organization._id}`}>
                                <div className="flex flex-col justify-center items-center">
                                    <div className="pt-4">
                                        <img src={organization.image_url || defaultOrganizationImage} alt="organization-image" className="w-28 h-28 rounded-full" />
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
                {/* Spacer */}
                <div className="h-8"></div>
                {/* Pagination */}
                <Pagination
                    currentPage={state.currentPage}
                    limit={state.limit}
                    totalItems={state.totalItems}
                    totalPages={state.totalPages}
                    handlePageChange={handlePageChange}
                    handleNextPage={handleNextPage}
                    handlePrevPage={handlePrevPage}
                />
            </div>
        </>
    )
}

export default OrganizationsPage;