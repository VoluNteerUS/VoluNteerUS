import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../components/navigation/Navbar';
import StatCard from '../../components/dashboard/StatCard';
import ContentCard from '../../components/dashboard/ContentCard';
import EventRow from '../../components/dashboard/EventRow';
import AdminProtected from '../../common/protection/AdminProtected';
import axios from 'axios';
import { setEvents } from '../../actions/eventActions';
import { setOrganizations } from '../../actions/organizationActions';
import { 
  setEventCount, setOrganizationCount, setCommitteeMemberCount, 
  setUserCount, setRecentlyCreatedEvents 
} from '../../actions/adminDashboardActions';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function AdminDashboard() {
  const adminDashboardReducer = useSelector((state) => state.adminDashboard);
  const [loaded, setLoaded] = useState(false);
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

  const getAllEvents = async () => {
    const eventsURL = new URL("/events", process.env.REACT_APP_BACKEND_API);
    await axios.get(eventsURL)
      .then((res) => {
        const paginatedEvents = { ...res.data };
        dispatch(setEventCount(paginatedEvents.totalItems));
      })
      .catch(err => console.error({ err }));
  }

  const getAllOrganizations = async () => {
    const organizationsURL = new URL("/organizations", process.env.REACT_APP_BACKEND_API);
    await axios.get(organizationsURL)
      .then((res) => {
        const paginatedOrganizations = { ...res.data };
        dispatch(setOrganizationCount(paginatedOrganizations.totalItems));
      })
      .catch(err => console.error({ err }));
  }

  const getAllUsers = async () => {
    const usersURL = new URL("/users", process.env.REACT_APP_BACKEND_API);
    await axios.get(usersURL)
      .then((res) => {
        const paginatedUsers = { ...res.data };
        dispatch(setUserCount(paginatedUsers.totalItems));
      })
      .catch(err => console.error({ err }));
  }

  const getCommitteeMembersCount = async () => {
    const committeeMembersURL = new URL("/users/committeeMemberCount", process.env.REACT_APP_BACKEND_API);
    await axios.get(committeeMembersURL)
      .then((res) => {
        const count = res.data;
        dispatch(setCommitteeMemberCount(count));
      })
      .catch(err => console.error({ err }));
  }

  const getLatestEvents = async () => {
    const latestEventsURL = new URL("/events/latest", process.env.REACT_APP_BACKEND_API);
    await axios.get(latestEventsURL)
      .then((res) => {
        const latestEvents = res.data;
        dispatch(setRecentlyCreatedEvents(latestEvents));
      })
      .catch(err => console.error({ err }));
  }

  useEffect(() => {
    Promise.all([getAllEvents(), getAllOrganizations(), getAllUsers(), getCommitteeMembersCount(), getLatestEvents()]).then(() => {
      setLoaded(true);
    });
  }, [])

  return (
    <AdminProtected>
      <Navbar />
      <div className="block mx-auto px-6 sm:w-4/5 sm:px-0 lg:w-3/4">
        <h1 className="font-bold text-3xl py-6">Admin Dashboard</h1>
        { loaded ? (
        <div className="grid grid-cols-12 gap-4">
          <StatCard title={"Organizations"} route={'/admin/organizations'} value={adminDashboardReducer.organizationCount} />
          <StatCard title={"Events"} route={'/admin/events'} value={adminDashboardReducer.eventCount} />
          <StatCard title={"Committee Members"} value={adminDashboardReducer.committeeMemberCount} />
          <StatCard title={"Users"} route={'/admin/users'} value={adminDashboardReducer.userCount} />
        </div>
        ) : (<div>Loading...</div>)}
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
                    adminDashboardReducer.recentlyCreatedEvents.length === 0 ? (
                      <div className="text-center py-4">No events have been created yet.</div>
                    ) :
                    adminDashboardReducer.recentlyCreatedEvents.slice(0, 3).map((event) => {
                      return (
                        <EventRow event={event} key={event._id} />
                      )
                    })
                  }
                </>
              }
            />
          </div>
        </div>
      </div>
    </AdminProtected>
  )
}

export default AdminDashboard;