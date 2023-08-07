import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Pagination from "../../components/navigation/Pagination";
import AppDialog from "../../components/AppDialog";
import { ArrowsUpDownIcon, CheckIcon, FunnelIcon, MagnifyingGlassIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Listbox } from '@headlessui/react'
import AdminProtected from "../../common/protection/AdminProtected";
import { api } from "../../services/api-service";

function AdminUserDashboard() {
  const filters = [
    'All',
    'Admin',
    'Committee Member',
    'User',
  ];

  const sorts = [
    'Name',
    'Role'
  ];

  const [state, setState] = useState({
    currentPage: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 0,
    searchQuery: "",
  })

  const persistedUserState = useSelector((state) => state.user);
  const user = persistedUserState.user;
  const [users, setUsers] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [selectedSort, setSelectedSort] = useState(sorts[0]);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [totalCount, setTotalCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState({});

  const handlePageChange = (page) => {
    setState({ ...state, currentPage: page });
  }

  const handleNextPage = () => {
    setState({ ...state, currentPage: state.currentPage + 1 });
  }

  const handlePrevPage = () => {
    setState({ ...state, currentPage: state.currentPage - 1 });
  }

  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsDialogOpen(true);
  }

  const handleConfirmDelete = async () => {
    try {
      await api.deleteUser(localStorage.getItem("token"), userToDelete._id, user.role);
      setIsDialogOpen(false);
      setUserToDelete({});
    } catch (err) {
      console.error({ err });
    }
  }

  const handleCancelDelete = () => {
    setIsDialogOpen(false);
    setUserToDelete({});
  }

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await api.getAllUsers(localStorage.getItem("token"), state.searchQuery, selectedFilter, selectedSort, state.currentPage, state.limit);
        const paginatedUsers = { ...res.data };
        setUsers(paginatedUsers.result);
        setState({
          ...state,
          currentPage: paginatedUsers.currentPage,
          totalItems: paginatedUsers.totalItems,
          totalPages: paginatedUsers.totalPages
        });
      } catch (err) {
        console.error({ err });
      }
    }

    const getTotalCount = async () => {
      try {
        const res = await api.getUserCount(localStorage.getItem("token"));
        setTotalCount(res.data);
      } catch (err) {
        console.error({ err });
      }
    }

    getUsers();
    getTotalCount();
  }, [state.currentPage, selectedFilter, selectedSort, state.searchQuery, userToDelete])

  return (
    <AdminProtected>
      <div className="py-8">
        <div className="block mx-auto lg:w-3/4 bg-neutral-100 rounded-lg p-8">
          <div className="flex flex-row flex-wrap justify-between items-center">
            <div className="flex flex-col pb-4">
              <h1 className="font-bold text-3xl">Users</h1>
              <p className="text-gray-600">{totalCount} users joined!</p>
            </div>
            <div className="flex flex-row flex-wrap gap-4 mb-4 lg:mb-0">
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
                      placeholder="Search users"
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
                {/* Filter Button */}
                <Listbox value={selectedFilter} onChange={setSelectedFilter}>
                  <div className="relative w-48">
                    <Listbox.Button className="relative h-10 w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75 sm:text-sm">
                      <span className="block truncate">{selectedFilter}</span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <FunnelIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-20">
                      {filters.map((filter, filterIdx) => (
                        <Listbox.Option
                          key={filterIdx}
                          className={({ active }) =>
                            `${active ? 'text-neutral-900 bg-primary-300' : 'text-gray-900'}
                            cursor-default select-none relative py-2 pl-10 pr-4`
                          }
                          value={filter}
                        >
                          {({ selected, active }) => (
                            <>
                              <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                                {filter}
                              </span>
                              {selected ? (
                                <span
                                  className={`${active ? 'text-primary-600' : 'text-primary-600'}
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
                                  className={`${active ? 'text-primary-600' : 'text-primary-600'}
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
          </div>
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-primary-600">
                <tr>
                  <th className="pe-6 py-3 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider"></th>
                  <th className="pe-6 py-3 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">Full Name</th>
                  <th className="pe-6 py-3 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">Email</th>
                  <th className="pe-6 py-3 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">Role</th>
                  <th className="pe-6 py-3 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {
                  users.map((user) => {
                    return (
                      <tr key={user._id} className="bg-white">
                        <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">
                          <img
                            className="h-12 w-12 rounded-full"
                            src={`https://ui-avatars.com/api/?name=${user.full_name ?? ''}&background=FF71A3&color=fff`}
                            alt="Profile Picture"
                          />
                        </td>
                        <td className="pe-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium hover:text-neutral-500">
                          <Link to={`/users/${user._id}`}>{user.full_name}</Link>
                        </td>
                        <td className="pe-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">
                          {user.email}
                        </td>
                        <td className="pe-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">
                          {user.role}
                        </td>
                        <td className="pe-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">
                          <div className="flex items-center">
                            <button 
                              type="button" 
                              className="flex items-center space-x-2 text-danger-600 hover:text-danger-400"
                              onClick={() => handleDelete(user)}
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
        { isDialogOpen && (
          <AppDialog
            isOpen={isDialogOpen}
            title="Confirm Delete"
            description={`Are you sure you want to delete the user "${userToDelete.full_name}"?`}
            warningMessage={`This action cannot be undone.`}
            actionName="Delete"
            handleAction={handleConfirmDelete}
            handleClose={handleCancelDelete}
          />
        )}
      </div >
    </AdminProtected>
  );
}

export default AdminUserDashboard;