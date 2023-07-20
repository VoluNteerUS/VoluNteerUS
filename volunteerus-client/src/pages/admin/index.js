import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../components/navigation/Navbar';
import StatCard from '../../components/dashboard/StatCard';
import ContentCard from '../../components/dashboard/ContentCard';
import EventRow from '../../components/dashboard/EventRow';
import AdminProtected from '../../common/protection/AdminProtected';
import axios from 'axios';
import { 
  setEventCount, setOrganizationCount, setCommitteeMemberCount, 
  setUserCount, setRecentlyCreatedEvents, setChartData 
} from '../../actions/adminDashboardActions';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import moment from 'moment';

function AdminDashboard() {
  const adminDashboardReducer = useSelector((state) => state.adminDashboard);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  const chartData = [
    {
      date: moment().subtract(5, 'days').format('YYYY-MM-DD'),
      signups: 0,
      amt: 0,
    },
    {
      date: moment().subtract(4, 'days').format('YYYY-MM-DD'),
      signups: 0,
      amt: 0,
    },
    {
      date: moment().subtract(3, 'days').format('YYYY-MM-DD'),
      signups: 0,
      amt: 0,
    },
    {
      date: moment().subtract(2, 'days').format('YYYY-MM-DD'),
      signups: 0,
      amt: 0,
    },
    {
      date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      signups: 0,
      amt: 0,
    },
    {
      date: moment().format('YYYY-MM-DD'),
      signups: 0,
      amt: 0,
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

  const getChartData = async () => {
    for (let i = 0; i < 6; i++) {
      const chartDataURL = new URL(`/events/signUpCount?date=${chartData[i]['date']}`, process.env.REACT_APP_BACKEND_API);
      await axios.get(chartDataURL)
      .then((res) => {
        chartData[i]['signups'] = res.data;
        chartData[i]['amt'] = res.data;
      })
      .catch(err => console.error({ err }));
    }

    dispatch(setChartData(chartData));
  }

  useEffect(() => {
    Promise.all([getAllEvents(), getAllOrganizations(), getAllUsers(), getCommitteeMembersCount(), getLatestEvents(), getChartData()]).then(() => {
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
          <div className="col-span-12 xl:col-span-8">
            <ContentCard
              title={"Event Sign Ups"}
              children={
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart 
                    data={adminDashboardReducer.chartData}
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
          <div className="col-span-12 xl:col-span-4">
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