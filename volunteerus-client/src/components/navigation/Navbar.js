import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import {
  Bars3Icon, CalendarDaysIcon, CalendarIcon,
  HomeIcon, MagnifyingGlassIcon, UserGroupIcon, 
  UserIcon, XMarkIcon
} from '@heroicons/react/24/outline'
import logo from '../../assets/images/logo.png'
import ProfileDropdown from './ProfileDropdown'

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Events', href: '/events', icon: CalendarDaysIcon },
  { name: 'Organizations', href: '/organizations', icon: UserGroupIcon },
  { name: 'Calendar', href: '#', icon: CalendarIcon },
]

const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Manage Events', href: '/admin/events', icon: CalendarDaysIcon },
  { name: 'Manage Organizations', href: '/admin/organizations', icon: UserGroupIcon },
  { name: 'Manage Users', href: '/admin/users', icon: UserIcon },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const { user } = useSelector((state) => state.user);
  const [state, setState] = useState(
    {
      "isAuthenticated": localStorage.getItem("token") ? true : false,
      "isAdmin": user?.role === "ADMIN" ? true : false,
      "userOrganizations": [
        // {
        //   "id": 1,
        //   "name": "NUS Students' Community Service Club",
        //   "iconURL": "https://ui-avatars.com/api/?name=NUS+Students%27+Community+Service+Club&background=0D8ABC&color=fff",
        //   "href": "#",
        // },
        // {
        //   "id": 2,
        //   "name": "NUS Rotaract Club",
        //   "iconURL": "https://ui-avatars.com/api/?name=NUS+Students%27+Community+Service+Club&background=0D8ABC&color=fff",
        //   "href": "#",
        // },
      ],
    }
  );

  const openSideNav = () => {
    // If screen width is less than 640px, open side to full screen
    if (window.innerWidth < 640) {
      document.getElementById("sideNav").style.width = "100%";
    } else {
      document.getElementById("sideNav").style.width = "300px";
    }
  }

  const closeSideNav = () => {
    document.getElementById("sideNav").style.width = "0";
  }

  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  }

  return (
    <>
      {/* Side Menu */}
      <div id="sideNav" className='h-screen w-0 fixed z-20 top-0 left-0 bg-neutral-100 overflow-x-hidden ease-out duration-500'>
        <div className="flex items-center justify-between">
          <div className="flex items-center ml-4">
            <img className="h-14 w-auto mx-auto" src={logo} alt="VoluNteerUS Logo" />
          </div>
          <div className="flex items-center mr-4">
            <XMarkIcon className="h-8 w-8 text-gray-500" aria-hidden="true" onClick={closeSideNav} />
          </div>
        </div>
        {(state.isAdmin && state.isAuthenticated) ? adminNavigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={classNames(isActive(item.href) ? 'bg-pink-300 text-black' : 'text-gray-500', 'flex items-center px-4 py-2 text-sm sm:text-base font-medium hover:text-gray-900 hover:bg-neutral-200')}
          >
            <item.icon className="h-6 w-6 mr-3" aria-hidden="true" />
            {item.name}
          </Link>
        )) : navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={classNames(isActive(item.href) ? 'bg-pink-300 text-black' : 'text-gray-500', 'flex items-center px-4 py-2 text-sm sm:text-base font-medium hover:text-gray-900 hover:bg-neutral-200')}
          >
            <item.icon className="h-6 w-6 mr-3" aria-hidden="true" />
            {item.name}
          </Link>
        ))}
        {/* Divider */}
        <div className="border-t border-gray-200 border-2"></div>
        {/* My Organizations */}
        {
          (state.userOrganizations.length > 0) ? (
            <span className="px-4 uppercase font-extra-bold">My Organizations</span>
          ) : null
        }
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
      <div className="h-14 flex bg-neutral-100 sticky top-0 z-10">
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
              <div className="relative text-gray-600 focus-within:text-gray-400">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <button type="submit" className="p-1 focus:outline-none focus:shadow-outline">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 object-contain" aria-hidden="true" />
                  </button>
                </span>
                <input type="search" name="q" className="h-10 py-2 text-sm text-gray-700 bg-white rounded-md pl-10 focus:outline-blue-500 w-full" placeholder="Search..." />
              </div>
            </form>
          </div>
          {/* Profile dropdown */}
          <div className="flex items-center space-x-4 me-4">
            <ProfileDropdown isAuthenticated={state.isAuthenticated} />
          </div>
        </div>
      </div>
    </>
  )
}