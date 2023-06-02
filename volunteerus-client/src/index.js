import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OrganizationsPage from './pages/organizations';
import CreateOrganizationPage from './pages/organizations/Create';
import AdminDashboard from './pages/admin';
import Events from './pages/events';
import { Provider } from 'react-redux';
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react'
import { store, persistor } from './store';
import OrganizationDetails from './pages/organizations/Details';
import CreateEvent from './pages/createEvent/index.js';
import CreateEvent2 from './pages/createEvent/CreateEvent2';
import EventSignup from './pages/events/Signup';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="organizations">
              <Route index element={<OrganizationsPage />} />
              <Route path=":id" element={<OrganizationDetails />} />
              <Route path="create" element={<CreateOrganizationPage />} />
            </Route>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="events">
              <Route index element={<Events />}/>
              <Route path=":id" element={<EventSignup />} />
            </Route>  
            <Route path="create-event">
              <Route index element={<CreateEvent />} />
              <Route path="2" element={<CreateEvent2 />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
    </PersistGate>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
