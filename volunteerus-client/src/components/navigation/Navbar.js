import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { 
  ArrowLeftOnRectangleIcon, Bars3Icon, BellIcon, CalendarDaysIcon, CalendarIcon, ClipboardIcon, Cog6ToothIcon, 
  FolderIcon, HomeIcon, MagnifyingGlassIcon, UserIcon, UserGroupIcon, XMarkIcon 
} from '@heroicons/react/24/outline'
import logo from '../../assets/images/logo.png'
import { Link } from 'react-router-dom'

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon, current: true },
  { name: 'Events', href: '#', icon: CalendarDaysIcon, current: false },
  { name: 'Organizations', href: '#', icon: UserGroupIcon, current: false },
  { name: 'Calendar', href: '#', icon: CalendarIcon, current: false },
]

const userNavigation = [
  { name: 'Profile', href: '#', icon: UserIcon },
  { name: 'Settings', href: '#', icon: Cog6ToothIcon },
  { name: 'Volunteering Records', href: '#', icon: ClipboardIcon },
  { name: 'My Submissions', href: '#', icon: FolderIcon },
  { name: 'Sign out', href: '#', icon: ArrowLeftOnRectangleIcon },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function ProfileDropdown({ isAuthenticated, fullName }) {
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
                    src="https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff"
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
                    <img className="block mx-auto h-14 w-14 rounded-full" src="https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff" alt="Profile Picture" />
                    <div className="text-center px-4 pt-2">
                      <p className="font-semibold text-gray-900">{ fullName }</p>
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

export default function Navbar() {
  const [state, setState] = useState(
    {
      "token": "",
      "userID": "",
      "fullName": "John Doe",
      "isAuthenticated": true,
      "userOrganizations": [
        {
          "id": 1,
          "name": "NUS Students' Community Service Club",
          "iconURL" : "https://ui-avatars.com/api/?name=NUS+Students%27+Community+Service+Club&background=0D8ABC&color=fff",
          "href": "#",
        },
        {
          "id": 2,
          "name": "NUS Rotaract Club",
          "iconURL" : "https://ui-avatars.com/api/?name=NUS+Students%27+Community+Service+Club&background=0D8ABC&color=fff",
          "href": "#",
        },
      ],
    }
  );

  const openSideNav = () => {
    document.getElementById("sideNav").style.width = "300px";
  }

  const closeSideNav = () => {
    document.getElementById("sideNav").style.width = "0";
  }

  return (
    <>
      {/* Side Menu */}
      <div id="sideNav" className='h-screen w-0 fixed z-10 top-0 left-0 bg-neutral-100 overflow-x-hidden ease-out duration-500'>
        <div className="flex items-center justify-between">
          <div className="flex items-center ml-4">
            <img className="h-14 w-auto mx-auto" src={logo} alt="VoluNteerUS Logo" />
          </div>
          <div className="flex items-center mr-4">
            <XMarkIcon className="h-8 w-8 text-gray-500" aria-hidden="true" onClick={closeSideNav} />
          </div>
        </div>
        {
          navigation.map((item) => (
            <Link 
              key={item.name} 
              to={item.href} 
              className={ classNames(item.current ? 'bg-pink-300 text-black' : 'text-gray-500', 'flex items-center px-4 py-2 text-base font-medium hover:text-gray-900 hover:bg-neutral-200')}
            >
              <item.icon className="h-6 w-6 mr-3" aria-hidden="true" />
              {item.name}
            </Link>
          ))
        }
        {/* Divider */}
        <div className="border-t border-gray-200 border-2"></div>
        {/* My Organizations */}
        <span className="px-4 uppercase font-extra-bold">My Organizations</span>
        {
          state.userOrganizations.map((item) => (
            <Link key={item.id} to="#" className="flex items-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-neutral-200">
              {/* <UserGroupIcon className="h-6 w-6 mr-3" aria-hidden="true" /> */}
              <img className="h-6 w-6 mr-3 rounded-full" src={item.iconURL} />
              <div className="text-ellipsis overflow-hidden whitespace-nowrap">{item.name}</div>
            </Link>
          ))
        }   
      </div>

      {/* Top Menu Bar with hidden side menu */}
      <div className="h-14 flex bg-neutral-100 sticky top-0">
        {/* Off-canvas menu for mobile, show/hide based on off-canvas menu state. */}
        <div className="w-screen flex items-center mx-auto justify-between px-2">
          {/* Hamburger button */}
          <div className="flex items-center ps-2">
            <div className="flex items-center pe-3">
              <button onClick={openSideNav}>
                <Bars3Icon className="block h-8 w-8" aria-hidden="true" />
              </button>
            </div>

            {/* Desktop logo */}
            <div className="flex items-center ps-3">
              <img
                className="hidden h-10 w-auto md:block"
                src={logo}
                alt="VoluNteerUS Logo"
              />
            </div>
          </div>
          {/* Logo */}
          <div className="flex flex-1 items-center justify-center md:hidden md:items-stretch md:justify-start">
            <div className="flex flex-shrink-0 items-center">
              {/* Mobile logo */}
              <img
                className="block h-10 w-auto lg:hidden"
                src={logo}
                alt="VoluNteerUS Logo"
              />
            </div>
          </div>
          {/* Search bar */}
          <div className="hidden md:flex md:basis-1/2 lg:basis-1/3 xl:basis-1/4 items-center justify-center">
            <form method="GET" className="w-full">
              <div class="relative text-gray-600 focus-within:text-gray-400">
                <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                  <button type="submit" class="p-1 focus:outline-none focus:shadow-outline">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 object-contain" aria-hidden="true" />
                  </button>
                </span>
                <input type="search" name="q" class="h-10 py-2 text-sm text-gray-700 bg-white rounded-md pl-10 focus:outline-blue-500 w-full" placeholder="Search..." autocomplete="off" />
              </div>
            </form>
          </div>
          {/* Profile dropdown */}
          <div className="flex items-center space-x-4 me-4">
            <ProfileDropdown isAuthenticated={ state.isAuthenticated } fullName={ state.fullName } />
          </div>
        </div>
      </div>
    </>
  )
}
