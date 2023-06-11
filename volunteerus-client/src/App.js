import './App.css';
import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

// Code splitting of routes
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const OrganizationsPage = lazy(() => import('./pages/organizations'));
const OrganizationDetailsPage = lazy(() => import('./pages/organizations/Details'));
const CreateOrganizationPage = lazy(() => import('./pages/organizations/Create'));
const EditOrganizationPage = lazy(() => import('./pages/organizations/Edit'));
const OrganizationDashboard = lazy(() => import('./pages/organizations/Dashboard'));
const Events = lazy(() => import('./pages/events'));
const CreateEvent = lazy(() => import('./pages/events/createEvent'));
const CreateEvent2 = lazy(() => import('./pages/events/createEvent/CreateEvent2'));
const EventSignup = lazy(() => import('./pages/events/Signup'));
const AdminDashboard = lazy(() => import('./pages/admin'));
const AdminEventDashboard = lazy(() => import('./pages/events/Admin'));
const AdminOrganizationDashboard = lazy(() => import('./pages/organizations/Admin'));
const AdminUserDashboard = lazy(() => import('./pages/user/Admin'));
const AuthProtected = lazy(() => import('./common/protection/AuthProtected'));
const AdminProtected = lazy(() => import('./common/protection/AdminProtected'));


function App() {
  const { user } = useSelector((state) => state.user);

  console.log(user);

  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="organizations">
            <Route index element={<OrganizationsPage />} />
            <Route path=":id">
              <Route index element={<OrganizationDetailsPage />} />
              <Route path="dashboard" element={<OrganizationDashboard />} />
              <Route path="edit" element={<EditOrganizationPage />} />
            </Route>
            <Route path="create" element={<CreateOrganizationPage />} />
          </Route>
          <Route path="admin">
            <Route
              index
              element={
                <AdminProtected>
                  <AdminDashboard />
                </AdminProtected>
              }
            />
            <Route path="events">
              <Route 
                index 
                element={
                  <AdminProtected>
                    <AdminEventDashboard />
                  </AdminProtected>
                } 
              />
            </Route>
            <Route path="organizations">
              <Route 
                index 
                element={
                  <AdminProtected>
                    <AdminOrganizationDashboard />
                  </AdminProtected>
                } 
              />
            </Route>
            <Route path="users">
              <Route 
                index 
                element={
                  <AdminProtected>
                    <AdminUserDashboard />
                  </AdminProtected>
                } 
              />
            </Route>
          </Route>
          <Route path="events">
            <Route index element={<Events />} />
            <Route path=":id" element={<EventSignup />} />
            <Route path="create" element={<CreateEvent />} />
          </Route>
          <Route path="create">
            <Route index element={<CreateEvent />} />
            <Route path="2" element={<CreateEvent2 />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;