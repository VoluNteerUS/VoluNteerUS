import './App.css';
import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useNavbarVisibility from './helpers/useNavbarVisibility';
import Navbar from './components/navigation/Navbar';

// Code splitting of routes
// Pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const PasswordReset = lazy(() => import('./pages/PasswordReset'));

// User Pages
const Submissions = lazy(() => import('./pages/user/Submissions'));
const EditResponse = lazy(() => import('./pages/user/EditResponse'));
const UserDashboard = lazy(() => import('./pages/user/Dashboard'));
const UserProfile = lazy(() => import('./pages/user/Profile'));
const Records = lazy(() => import('./pages/user/Records'));
const PublicUserProfile = lazy(() => import('./pages/user/PublicProfile'))
const BasicProfileSetUp = lazy(() => import('./pages/user/ProfileSetUp'))
const Settings = lazy(() => import('./pages/user/Settings'))

// Events
const Events = lazy(() => import('./pages/events'));
const CreateEvent = lazy(() => import('./pages/events/Create'));
const EventSignup = lazy(() => import('./pages/events/Signup'));
const EditEventDetails = lazy(() => import('./pages/events/Edit'));
const ViewResponses = lazy(() => import('./pages/events/Responses'));
const EventDetails = lazy(() => import('./pages/events/Details'));

// Organizations
const OrganizationsPage = lazy(() => import('./pages/organizations'));
const OrganizationDetailsPage = lazy(() => import('./pages/organizations/Details'));
const CreateOrganizationPage = lazy(() => import('./pages/organizations/Create'));
const EditOrganizationPage = lazy(() => import('./pages/organizations/Edit'));
const OrganizationDashboard = lazy(() => import('./pages/organizations/Dashboard'));

// Admin
const AdminDashboard = lazy(() => import('./pages/admin'));
const AdminEventDashboard = lazy(() => import('./pages/admin/Events'));
const AdminOrganizationDashboard = lazy(() => import('./pages/admin/Organizations'));
const AdminUserDashboard = lazy(() => import('./pages/admin/Users'));

// Auth Pages
const PageNotFound = lazy(() => import('./pages/PageNotFound'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));

function App() {
  const shouldShowNavbar = useNavbarVisibility();
  const persistedUserState = useSelector((state) => state.user);
  const user = persistedUserState?.user || 'Unknown';

  return (
    <div className="App">
      {shouldShowNavbar && <Navbar />}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgotPassword" element={<ForgotPassword />} />
          <Route path="passwordReset" element={<PasswordReset />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="records" element={<Records />} />
          <Route path="settings" element={<Settings />} />
          <Route path="setup" element={<BasicProfileSetUp />} />
          <Route path="users">
            <Route path=":userId" element={<PublicUserProfile />} />
          </Route>
          {/* id === user_id */}
          <Route path=":id">
            <Route path="submissions" element={<Submissions />} />
          </Route>
          {/* id === response_id */}
          <Route path=":id">
            <Route path="edit" element={<EditResponse />} />
          </Route>
          {/* id === organization_id */}
          <Route path=":id">
            <Route path=":eventId/edit" element={<EditEventDetails />} />
            <Route path=":eventId/volunteers" element={<ViewResponses />} />
          </Route>
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
            <Route index element={<AdminDashboard />} />
            <Route path="events">
              <Route index element={<AdminEventDashboard />} />
            </Route>
            <Route path="organizations">
              <Route index element={<AdminOrganizationDashboard />} />
            </Route>
            <Route path="users">
              <Route index element={<AdminUserDashboard />}/>
            </Route>
          </Route>
          <Route path="events">
            <Route index element={<Events />} />
              <Route path=":id">
                <Route index element={<EventDetails />} />
                <Route path="signup" element={<EventSignup />} />
              </Route>
              <Route path="create" element={<CreateEvent />} />
          </Route>
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;