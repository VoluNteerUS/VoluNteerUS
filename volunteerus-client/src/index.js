import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react'
import { store, persistor } from './store';

// Code splitting of routes
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const OrganizationsPage = lazy(() => import('./pages/organizations'));
const OrganizationDetailsPage = lazy(() => import('./pages/organizations/Details'));
const CreateOrganizationPage = lazy(() => import('./pages/organizations/Create'));
const EditOrganizationPage = lazy(() => import('./pages/organizations/Edit'));
const OrganizationDashboard = lazy(() => import('./pages/organizations/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/admin'));
const Events = lazy(() => import('./pages/events'));
const CreateEvent = lazy(() => import('./pages/events/Create'));
const EventSignup = lazy(() => import('./pages/events/Signup'));
const Users = lazy(() => import('./pages/admin/Users'));
const EditEventDetails = lazy(() => import('./pages/events/Edit'));
const Submissions = lazy(() => import('./pages/users/Submissions'));

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <React.StrictMode>
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<App />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="organizations">
                  <Route index element={<OrganizationsPage />} />
                  <Route path=":id">
                    <Route index element={<OrganizationDetailsPage />} />
                    <Route path="dashboard" element={<OrganizationDashboard />} />
                    <Route path="edit" element={<EditOrganizationPage/>} />
                  </Route>
                  <Route path="create" element={<CreateOrganizationPage />} />
                </Route>
                <Route path="admin">
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<Users />} />
                </Route>
                <Route path="events">
                  <Route index element={<Events />} />
                  <Route path=":id" element={<EventSignup />} />
                  <Route path=":id/edit" element={<EditEventDetails />} />
                  <Route path="create" element={<CreateEvent />} />
                </Route>
                <Route path=":id">
                  <Route path="submissions" element={<Submissions />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </React.StrictMode>
    </PersistGate>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();