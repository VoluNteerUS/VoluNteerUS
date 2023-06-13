import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../components/navigation/Navbar';
import StatCard from '../../components/dashboard/StatCard';
import ContentCard from '../../components/dashboard/ContentCard';
import EventRow from '../../components/dashboard/EventRow';
import axios from 'axios';
import { setEvents } from '../../actions/eventActions';
import { setOrganizations } from '../../actions/organizationActions';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function AdminDashboard() {
  const organizationsReducer = useSelector((state) => state.organizations)
  const eventsReducer = useSelector((state) => state.events)
  const organizations = organizationsReducer?.organizations
  const events = eventsReducer?.events
  const [users, setUsers] = useState([]);
  const [state, setState] = useState({
    organizationsCount: 0,
    eventsCount: 0,
    usersCount: 0,
    committeeMembersCount: 4,
  });
  const dispatch = useDispatch();

  // To be replaced with actual data
  const chartData = [
    {
      date: '1/1/2023',
      signups: 10,
      amt: 10,
    },
    {
      date: '1/2/2023',
      signups: 20,
      amt: 20,
    },
    {
      date: '1/3/2023',
      signups: 30,
      amt: 30,
    },
    {
      date: '1/4/2023',
      signups: 50,
      amt: 50,
    },
    {
      date: '1/5/2023',
      signups: 80,
      amt: 80,
    },
    {
      date: '1/6/2023',
      signups: 100,
      amt: 100,
    },
  ];

  const getAllEvents = () => {
    const eventsURL = new URL("/events", process.env.REACT_APP_BACKEND_API);
    axios.get(eventsURL)
      .then((res) => {
        const paginatedEvents = { ...res.data };
        console.log(paginatedEvents.result);
        dispatch(setEvents(paginatedEvents.result));
        setState({
          ...state,
          eventsCount: paginatedEvents.totalItems,
        });
      })
      .catch(err => console.error({ err }));
  }

  const getAllOrganizations = () => {
    const organizationsURL = new URL("/organizations", process.env.REACT_APP_BACKEND_API);
    axios.get(organizationsURL)
      .then((res) => {
        const paginatedOrganizations = { ...res.data };
        dispatch(setOrganizations(paginatedOrganizations.result));
        setState({
          ...state,
          organizationsCount: paginatedOrganizations.totalItems,
        });
      })
      .catch(err => console.error({ err }));
  }

  const getAllUsers = () => {
    const usersURL = new URL("/users", process.env.REACT_APP_BACKEND_API);
    axios.get(usersURL)
      .then((res) => {
        const paginatedUsers = { ...res.data };
        setUsers(paginatedUsers.result);
        setState({
          ...state,
          usersCount: paginatedUsers.result.length,
        });
      })
      .catch(err => console.error({ err }));
  }

  useEffect(() => {
    getAllEvents();
    getAllOrganizations();
    getAllUsers();
  }, [])

  return (
    <>
      <Navbar />
      <div className="block mx-auto px-6 sm:w-4/5 sm:px-0 lg:w-3/4">
        <h1 className="font-bold text-3xl py-6">Admin Dashboard</h1>
        <div className="grid grid-cols-12 gap-4">
          <StatCard title={"Organizations"} value={organizations.length} />
          <StatCard title={"Events"} value={events.length} />
          {/* TODO: Replace with actual data */}
          <StatCard title={"Committee Members"} value={4} />
          <StatCard title={"Users"} value={users.length} />
        </div>
        <div className="grid grid-cols-12 gap-4 py-6">
          <div className="col-span-12 xl:col-span-7">
            <ContentCard
              title={"Event Sign Ups"}
              children={
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart 
                    data={chartData}
                    margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="signups" 
                      name="Number of Signups" 
                      stroke="#ff3860" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2} 
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              }
            />
          </div>
          <div className="col-span-12 xl:col-span-5">
            <ContentCard
              title={"Recently Created Events"}
              children={
                <>
                  {
                    events.slice(0, 3).map((event) => {
                      return (
                        <EventRow event={event} key={event.id} />
                      )
                    })
                  }
                </>
              }
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminDashboard;