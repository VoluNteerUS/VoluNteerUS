import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/navigation/Navbar";
import Pagination from "../../components/navigation/Pagination";

function AdminOrganizationDashboard() {
  const [state, setState] = useState({
    organizations: [],
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
    const getOrganizations = async () => {
      try {
        const organizationsURL = new URL(`/organizations?page=${state.currentPage}&limit=${state.limit}`, process.env.REACT_APP_BACKEND_API);
        const res = await axios.get(organizationsURL);
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

    getOrganizations();
  }, [state])

  return (
    <>
      <Navbar />
      <div className="py-8">
        <div className="block mx-auto lg:w-3/4 bg-neutral-100 rounded-lg p-8">
          <div className="pb-4 flex justify-between">
            <div className="flex-col">
              <h1 className="font-bold text-3xl">Organizations</h1>
              <p className="text-gray-600">{state.totalItems} organizations created</p>
            </div>
            <div className="flex-col">
              <Link to="/organizations/create" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-md hover:bg-primary-800">
                Create Organization
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead>
                <tr>
                  <th className="pe-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Photo</th>
                  <th className="pe-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Organization Name</th>
                  <th className="pe-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {
                  state.organizations.map((organization) => {
                    return (
                      <tr key={organization._id}>
                        <td className="pe-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">
                          <img src={organization.image_url} alt="" className="rounded-full w-16 h-16" />
                        </td>
                        <td className="pe-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">
                          {organization.name}
                        </td>
                        <td className="pe-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">
                          <Link to={`/organizations/${organization._id}/edit`} className="text-primary-600 hover:text-primary-800">
                            Edit
                          </Link>
                          <span className="px-2">|</span>
                          <button type="button" className="text-primary-600 hover:text-primary-800">
                            Delete
                          </button>
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
    </>
  );
}

export default AdminOrganizationDashboard;