import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Pagination from "../../components/navigation/Pagination";
import AppDialog from "../../components/AppDialog";
import AdminProtected from "../../common/protection/AdminProtected"
import { ArrowsUpDownIcon, CheckIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Listbox } from "@headlessui/react";
import { api } from "../../services/api-service";

function AdminOrganizationDashboard() {
  const persistedUserState = useSelector((state) => state.user);
  const user = persistedUserState.user;

  const sorts = [
    "A to Z",
    "Z to A",
  ];

  const [state, setState] = useState({
    organizations: [],
    currentPage: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 0,
    searchQuery: "",

  })

  const [totalCount, setTotalCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] = useState({});
  const [selectedSort, setSelectedSort] = useState(sorts[0]);

  const handlePageChange = (page) => {
    setState({ ...state, currentPage: page });
  }

  const handleNextPage = () => {
    setState({ ...state, currentPage: state.currentPage + 1 });
  }

  const handlePrevPage = () => {
    setState({ ...state, currentPage: state.currentPage - 1 });
  }

  const handleDelete = (organization) => {
    setOrganizationToDelete(organization);
    setIsDialogOpen(true);
  }

  const handleConfirmDelete = async () => {
    try {
      await api.deleteOrganization(localStorage.getItem("token"), organizationToDelete._id, user.role);
      setIsDialogOpen(false);
      setOrganizationToDelete({});
    } catch (err) {
      console.error({ err });
    }
  }

  const handleCancelDelete = () => {
    setIsDialogOpen(false);
    setOrganizationToDelete({});
  }

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

    const getTotalCount = async () => {
      try {
        const res = await api.getOrganizationCount();
        setTotalCount(res.data);
      } catch (err) {
        console.error({ err });
      }
    }

    getOrganizations();
    getTotalCount();
  }, [state.currentPage, state.limit, state.searchQuery, selectedSort, organizationToDelete])

  return (
    <AdminProtected>
      <div className="py-8">
        <div className="block mx-auto lg:w-3/4 bg-neutral-100 rounded-lg p-8">
          <div className="pb-4 flex justify-between items-center flex-wrap">
            <div className="flex-col">
              <h1 className="font-bold text-3xl">Organizations</h1>
              <p className="text-gray-600">{totalCount} organizations created</p>
            </div>
            <div className="flex-col">
              <div className="flex flex-row gap-4 flex-wrap mt-3 lg:mt-0">
                <div className="flex">
                  {/* Search Bar */}
                  <form method="GET">
                    <div className="relative text-gray-600 focus-within:text-gray-400 rounded-md shadow-md w-80">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                        <button type="submit" className="p-1 focus:outline-none focus:shadow-outline">
                          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 object-contain" aria-hidden="true" />
                        </button>
                      </span>
                      <input
                        type="search"
                        className="h-10 py-2 pe-2 text-sm text-gray-700 bg-white rounded-md pl-10 focus:outline-blue-500 w-full"
                        placeholder="Search organizations"
                        value={state.searchQuery}
                        onChange={(e) => {
                          setState({
                            ...state,
                            searchQuery: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </form>
                </div>
                <div className="flex">
                  {/* Sort Button */}
                  <Listbox value={selectedSort} onChange={setSelectedSort}>
                    <div className="relative w-32">
                      <Listbox.Button className="relative h-10 w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75 sm:text-sm">
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
                              `${active ? 'text-neutral-900 bg-primary-300' : 'text-gray-900'}
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
                                    className={`${active ? 'text-neutral-600' : 'text-neutral-600'}
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
                <div className="flex">
                  <Link to="/organizations/create" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-md hover:bg-primary-800">
                    Create Organization
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-primary-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">Photo</th>
                  <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">Organization Name</th>
                  <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {
                  state.organizations.map((organization) => {
                    return (
                      <tr className="bg-white" key={organization._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">
                          <img src={organization.image_url} alt="" className="rounded-full w-16 h-16" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">
                          {organization.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">
                          <div className="flex items-center">
                            <Link to={`/organizations/${organization._id}/edit`} className="flex items-center space-x-2 text-secondary-600 hover:text-secondary-700 ">
                              <span>Edit</span>
                              <PencilIcon className="w-5 h-5" aria-hidden="true" />
                            </Link>
                            <span className="px-2">|</span>
                            <button 
                              type="button" 
                              className="flex items-center space-x-2 text-danger-600 hover:text-danger-400"
                              onClick={() => handleDelete(organization)}
                            >
                              <span>Delete</span>
                              <TrashIcon className="w-5 h-5" aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  }
                  )
                }
              </tbody>
            </table>
          </div>
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
      </div>
      {isDialogOpen && (
        <AppDialog
          isOpen={isDialogOpen}
          title="Confirm Delete"
          description={`Are you sure you want to delete the organization "${organizationToDelete.name}"?`}
          warningMessage={`This action cannot be undone.`}
          actionName="Delete"
          handleAction={handleConfirmDelete}
          handleClose={handleCancelDelete}
        />
      )}
    </AdminProtected>
  );
}

export default AdminOrganizationDashboard;