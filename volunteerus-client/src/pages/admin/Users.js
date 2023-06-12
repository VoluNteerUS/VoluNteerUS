import { useEffect } from "react";
import Navbar from "../../components/navigation/Navbar";
import axios, { all } from "axios";
import { useState } from "react";
import { PencilIcon, MagnifyingGlassIcon, FunnelIcon, ArrowsUpDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Listbox } from "@headlessui/react";

function Users() {
  const [allUsers, setAllUsers] = useState([]);
  const [queryUsers, setQueryUsers] = useState("");
  const [filteredCategory, setFilteredCategory] = useState("All");
  const [filteredUsers, setFilteredUsers] = useState(allUsers);
  const [sort, setSort] = useState('Name');

  const filters = [
    'Admin', 
    'All',
    'Community Member', 
    'User',
  ];

  const sorts = [
    'Name',
    'Role'
  ];

  const getAllUsers = async () => {
    const usersURL = new URL("/users", process.env.REACT_APP_BACKEND_API);
    await axios.get(usersURL)
      .then((res) => {
        const users = res.data;
        setAllUsers(users);
      })
    .catch(err => console.error({ err }));
  }

  useEffect(() => {
    getAllUsers();
    getFilteredUsers();
  }, [sort, queryUsers, filteredCategory, allUsers])

  const getFilteredUsers = () => {
    // apply filter
    let newAllUsers = filteredCategory === "All" ? [...allUsers] : allUsers.filter((user) => {
      return user.role.toLowerCase() === filteredCategory.toLowerCase() 
    });
    // apply sort
    sort === 'Name' ? newAllUsers.sort((a, b) => a.full_name > b.full_name 
        ? 1
        : a.full_name === b.full_name
          ? 0
          : -1)
      : newAllUsers.sort((a, b) => a.role > b.role
        ? 1
        : a.role === b.role 
          ? 0
          : -1); 
    // apply search
    const searchedUsers = queryUsers ? newAllUsers.filter((user) => {
      return user.full_name.toLowerCase().includes(queryUsers.toLowerCase())
      || user.role.toLowerCase().includes(queryUsers.toLowerCase());
    }) : newAllUsers;

    setFilteredUsers(searchedUsers);
  }

  return (
    <>
      <Navbar />
      <div className="my-10 mx-20 space-y-10">
        <h1 className="text-4xl font-bold">Users</h1>
        {/* Search bar, filter button, sort button */}
        <div className="flex sm:flex-row md:basis-1/2 lg:basis-1/3 xl:basis-1/4 items-center justify-center space-x-5">
          <form method="GET" className="w-1/3">
            {/* Search bar */}
            <div className="relative text-gray-600 focus-within:text-gray-400 border border-black">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <button type="submit" className="p-1 focus:outline-none focus:shadow-outline">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 object-contain" aria-hidden="true" />
                </button>
              </span>
              <input 
                type="search" 
                className="h-10 py-2 text-sm text-gray-700 bg-white rounded-md pl-10 focus:outline-blue-500 w-full" 
                placeholder="Search users"
                value= { queryUsers }
                onChange={(e) => {
                  setQueryUsers(e.target.value);
                }}
              />
            </div>
          </form>
          <div className="flex flex-row space-x-2">
            {/* filter button */}
            <div className="flex flex-col"> 
              <Listbox value={ filteredCategory } onChange={ setFilteredCategory }>
                <Listbox.Button className="bg-white rounded-3xl p-2 border border-black flex items-center space-x-1 shadow-md">
                  <p>Filter</p>
                  <FunnelIcon className="fill-black w-5 h-5 flex" aria-hidden="true" />
                </Listbox.Button>
                
                <Listbox.Options className="overflow-auto shadow-lg bg-white">
                  {filters.map((filter) => (
                    <Listbox.Option 
                      key={filter} 
                      value={filter}
                      className={({ active }) =>
                        `relative select-none py-2 px-2 ${
                        active ? 'bg-pink-400 text-white' : 'text-black'
                        }`
                      } >
              
                      <div className="flex flex-row">
                      {filteredCategory.includes(filter) ? (
                        <span className="text-black">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        ) : null}
                        <span
                          className={`block truncate ${
                            filteredCategory.includes(filter) ? 'font-medium' : 'font-normal'
                          }`}
                        >
                        {filter}
                        </span>
                      </div>      
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
            </div>
            {/*  sort button */}
            <div className="flex flex-col"> 
              <Listbox value={ sort } onChange={ setSort } >
                <Listbox.Button className="bg-white rounded-3xl p-2 border border-black flex items-center space-x-1 shadow-md">
                  <p>Sort</p>
                  <ArrowsUpDownIcon className="fill-black w-5 h-5 flex" aria-hidden="true" />
                </Listbox.Button>
                
                <Listbox.Options className="overflow-auto shadow-lg bg-white">
                  {sorts.map((s) => (
                    <Listbox.Option 
                      key={ s } 
                      value={ s }
                      className={({ active }) =>
                        `relative select-none py-2 px-2 ${
                        active ? 'bg-pink-400 text-white' : 'text-black'
                        }`
                      } >
              
                      <div className="flex flex-row">
                      {sort.includes(s) ? (
                        <span className="text-black">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        ) : null}
                        <span
                          className={`block truncate ${
                            sort.includes(s) ? 'font-medium' : 'font-normal'
                          }`}
                        >
                        {s}
                        </span>
                      </div>      
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <table className="w-2/3 font-serif text-left border border-black">
            <tr className="text-xl bg-pink-400 text-white">
              <th></th>
              <th>Name</th>
              <th>Role</th>
              <th></th>
            </tr>
            {filteredUsers.map((user) => {
              return (
                <tr key={ user._id } className="text-lg border-t border-black h-14 bg-grey-100">
                  <td>
                    <img className="block mx-auto h-10 w-10 rounded-full border border-black" src={`https://ui-avatars.com/api/?name=${user.full_name}&background=F6D2D2&color=000`} alt="Profile Picture" />
                  </td>
                  <td>{ user.full_name }</td>
                  <td>{ user.role.charAt(0) + user.role.slice(1).toLowerCase() }</td>
                  <td>
                    <button><PencilIcon className="h-5 w-5"/></button>
                  </td>
                </tr>
              )
            })}
          </table>
        </div>
      </div>
    </>
  )
}

export default Users;