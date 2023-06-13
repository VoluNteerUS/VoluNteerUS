import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { 
  ArrowLeftOnRectangleIcon, BellIcon, ClipboardIcon, 
  Cog6ToothIcon, FolderIcon, UserIcon, 
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { removeUser } from '../../actions/userActions'

export default function ProfileDropdown({ isAuthenticated }) {
  const persistedUserState = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const userNavigation = [
    { name: 'Profile', href: '#', icon: UserIcon },
    { name: 'Settings', href: '#', icon: Cog6ToothIcon },
    { name: 'Volunteering Records', href: '#', icon: ClipboardIcon },
    { name: 'My Submissions', href: `/${ persistedUserState?.user?.id }/submissions`, icon: FolderIcon },
  ]

  const handleLogout = () => {
    // Clear token from local storage
    localStorage.removeItem("token");
    // Clear full name from local storage
    localStorage.removeItem("full_name");
    // Clear user from redux store
    dispatch(removeUser());
    // Reload page
    window.location.reload();
  }

  if (isAuthenticated) {
    return (
      <>
        <button
          type="button"
          className="rounded-full p-1 text-black hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
        </button>
        <Menu as="div" className="ml-3 relative">
          {({ open }) => (
            <>
              <div>
                <Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src={`https://ui-avatars.com/api/?name=${persistedUserState?.user?.full_name ?? ''}&background=0D8ABC&color=fff`}
                    alt="Profile Picture"
                  />
                </Menu.Button>
              </div>
              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  static
                  className="origin-top-right absolute right-0 mt-2 w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  {/* Profile Picture and Name */}
                  <div className="py-3">
                    <img className="block mx-auto h-14 w-14 rounded-full" src={`https://ui-avatars.com/api/?name=${persistedUserState?.user?.full_name ?? ''}&background=0D8ABC&color=fff`} alt="Profile Picture" />
                    <div className="text-center px-4 pt-2">
                      <p className="font-semibold text-gray-900">{persistedUserState?.user?.full_name ?? ''}</p>
                    </div>
                  </div>
                  {/* Divider */}
                  <div className="border-t border-gray-200 border-1"></div>
                  {/* Profile Menu Items */}
                  <div className="py-1">
                    {
                      userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          <Link to={item.href} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <item.icon className="h-6 w-6 mr-3" aria-hidden="true" />
                            {item.name}
                          </Link>
                        </Menu.Item>
                      ))
                    }
                    {/* Sing Out */}
                    <Menu.Item>
                      <Link onClick={handleLogout} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-3" aria-hidden="true" />
                        Sign Out
                      </Link>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </>
    );
  } else {
    return <Link to="/login" className="block px-4 py-2 text-base font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-800">Sign in</Link>;
  }
}