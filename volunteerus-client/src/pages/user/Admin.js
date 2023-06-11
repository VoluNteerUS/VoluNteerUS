import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/navigation/Navbar";
import Pagination from "../../components/navigation/Pagination";
import axios from "axios";

function AdminUserDashboard() {
  const [state, setState] = useState({
    users: [],
    currentPage: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 0,
    searchQuery: "",

  })
  const handlePageChange = (page) => {
    setState({ ...state, currentPage: page });
  }

  const handleNextPage = () => {
    setState({ ...state, currentPage: state.currentPage + 1 });
  }

  const handlePrevPage = () => {
    setState({ ...state, currentPage: state.currentPage - 1 });
  }

  useEffect(() => {
    const getUsers = async () => {
      try {
        const organizationsURL = new URL(`/users?page=${state.currentPage}&limit=${state.limit}`, process.env.REACT_APP_BACKEND_API);
        const res = await axios.get(organizationsURL);
        const paginatedOrganizations = { ...res.data };
        setState({
          ...state,
          users: paginatedOrganizations.result,
          totalItems: paginatedOrganizations.totalItems,
          totalPages: paginatedOrganizations.totalPages
        });
      } catch (err) {
        console.error({ err });
      }
    }

    getUsers();
  }, [state.currentPage])

  return (
    <>
      <Navbar />
      <div className="py-8">
        <div className="block mx-auto lg:w-3/4 bg-neutral-100 rounded-lg p-8">
          <div className="pb-4">
            <h1 className="font-bold text-3xl">Users</h1>
            <p className="text-gray-600">{state.totalItems} users joined!</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead>
                <tr>
                  <th className="pe-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider"></th>
                  <th className="pe-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Full Name</th>
                  <th className="pe-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Email</th>
                  <th className="pe-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Role</th>
                  {/* <th className="pe-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Actions</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {
                  state.users.map((user) => {
                    return (
                      <tr key={user._id}>
                        <td className="pe-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">
                          <img
                            className="h-12 w-12 rounded-full"
                            src={`https://ui-avatars.com/api/?name=${user.full_name ?? ''}&background=0D8ABC&color=fff`}
                            alt="Profile Picture"
                          />
                        </td>
                        <td className="pe-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">
                          {user.full_name}
                        </td>
                        <td className="pe-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">
                          {user.email}
                        </td>
                        <td className="pe-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">
                          {user.role}
                        </td>
                        {/* <td className="pe-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">
                          <Link to={`/organizations/${organization._id}/edit`} className="text-primary-600 hover:text-primary-800">
                            Edit
                          </Link>
                          <span className="px-2">|</span>
                          <button type="button" className="text-primary-600 hover:text-primary-800">
                            Delete
                          </button>
                        </td> */}
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
    </>
  );
}

export default AdminUserDashboard;