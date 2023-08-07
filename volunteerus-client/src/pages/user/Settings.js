import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppDialog from '../../components/AppDialog';
import Alert from '../../components/Alert';
import { api } from '../../services/api-service';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Sidebar = ({activeTab, setActiveTab}) => {
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const isActiveTab = (tabName) => {
    return tabName === activeTab;
  };
  return (
    <div className="hidden rounded-lg shrink-0 bg-white md:block md:mr-4">
      <nav className="flex-grow">
        <ul>
          {/* Sidebar navigation links */}
          <li>
            <a
              href="#account-security"
              className={classNames(isActiveTab("account-security") ? "bg-primary-600 text-white" : "", "block px-4 py-4 hover:bg-pink-300 rounded-t-lg")}
              onClick={() => handleTabChange("account-security")}
            >
              Account Security
            </a>
          </li>
          <li>
            <a
              href="#delete-account"
              className={classNames(isActiveTab("delete-account") ? "bg-primary-600 text-white" : "", "block px-4 py-4 hover:bg-pink-300 rounded-b-lg")}
              onClick={() => handleTabChange("delete-account")}
            >
              Delete Account
            </a>
          </li>
          {/* Add more navigation links here */}
        </ul>
      </nav>
    </div>
  );
};

const AccountSecurity = () => {
  const [state, setState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    error: null,
  });
  const [alertMessage, setAlertMessage] = useState(null);
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    // Reset errors and alerts
    setState({ ...state, error: null });
    setAlertMessage(null);
    // Check if current password is empty
    if (state.currentPassword === "") {
      setState({ ...state, error: "Please enter your current password." });
      return;
    }
    // Check if new password is empty
    if (state.newPassword === "") {
      setState({ ...state, error: "Please enter your new password." });
      return;
    }
    // Check if confirm new password is empty
    if (state.confirmNewPassword === "") {
      setState({ ...state, error: "Please confirm your new password." });
      return;
    }
    // Check if new password and confirm new password match
    if (state.newPassword !== state.confirmNewPassword) {
      setState({ ...state, error: "New password and confirm new password do not match." });
      return;
    }
    // Check if new password is at least 10 characters long with upper and lower case letters and numbers
    if (!state.newPassword.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{10,}$/)) {
      setState({ ...state, error: "Password must be at least 10 characters long and contain at least one upper case letter, one lower case letter and one number" });
      return;
    }
    // Check if new password and old password are the same
    if (state.currentPassword === state.newPassword) {
      setState({ ...state, error: "New password cannot be the same as your current password." });
      return;
    }
    // Send request to server
    await api.changePassword(
      localStorage.getItem("token"),
      {
        current_password: state.currentPassword,
        new_password: state.newPassword,
        confirm_new_password: state.confirmNewPassword
      }
    ).then((response) => {
      setAlertMessage({ type: "success", message: "Password changed successfully!"});
    }).catch((error) => {
      setState({ ...state, error: error.response.data.message });
    });
  }

  return (
    <>
      <h1 className="text-2xl font-bold py-3">Account Security</h1>
      <div className="grid grid-cols-12">
        <div className="col-span-12">
          <div className="px-6">
            {/* Alert */}
            {
                alertMessage && (
                    <Alert type={alertMessage.type} message={alertMessage.message} />
                )
            }
            <h1 className="text-2xl font-bold py-3">Change Password</h1>
            <form onSubmit={handlePasswordChange}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Current Password
                </label>
                <input 
                  className="shadow appearance-none border rounded w-full 
                             py-2 px-3 text-gray-700 leading-tight focus:outline-none 
                             focus:ring-primary-500 focus:border-primary-500" 
                  id="currentPassword" 
                  type="password" 
                  placeholder="******************" 
                  value={state.currentPassword} 
                  onChange={e => setState({ ...state, currentPassword: e.target.value })} 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  New Password
                </label>
                <input 
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-primary-500 focus:border-primary-500" 
                  id="newPassword" 
                  type="password" 
                  placeholder="******************" 
                  value={state.newPassword} 
                  onChange={e => setState({ ...state, newPassword: e.target.value })} 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Confirm New Password
                </label>
                <input 
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-primary-500 focus:border-primary-500" 
                  id="confirmNewPassword" 
                  type="password" 
                  placeholder="******************" 
                  value={state.confirmNewPassword} 
                  onChange={e => setState({ ...state, confirmNewPassword: e.target.value })} 
                />
              </div>
              <div className="mb-4">
              {
                state.error && (
                    <div className="flex items-center py-3" role="alert">
                        <p className="text-danger-600 text-sm">{state.error}</p>
                    </div>
                )
              }
              </div>
              <div className="flex items-center justify-between">
                <button className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

const DeleteAccount = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleDeleteAccount = async () => {
    await api.deleteAccount(localStorage.getItem("token")).then((response) => {
      localStorage.removeItem("token");
      window.location.href = "/";
    }).catch((error) => {
      console.log(error);
    });
  }
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  }
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  }
  return (
    <>
      <h1 className="text-2xl font-bold py-3">Delete Account</h1>
      <div className="grid grid-cols-12">
        <div className="col-span-12">
          <div className="p-6">
            <h1 className="text-2xl font-bold py-3">Delete Account</h1>
            <p className="text-gray-700 text-sm font-bold mb-2">This action is unreversible and will permanently delete your account.</p>
            <div className="flex items-center justify-between">
              <button 
                className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleOpenDialog}
              >
                Delete Your Account
              </button>
            </div>
          </div>
        </div>
      </div>
      <AppDialog 
        isOpen={isDialogOpen} 
        title={"Delete Account"} 
        description={"Are you sure you want to delete your account?"} 
        warningMessage={"This action is unreversible and will permanently delete your account."}
        actionName={"Delete"}
        handleAction={handleDeleteAccount}
        handleClose={handleCloseDialog} 
      />
    </>
  );
}

function Settings() {
  const [activeTab, setActiveTab] = React.useState("account-security");
  return (
    <>
      <div className="block mx-auto px-4 lg:w-3/4 lg:px-0">
        <div className="h-4"></div>
        {/* Breadcrumbs */}
        <div className="flex items-center text-base py-2 px-3 md:px-0">
            <Link to={localStorage.getItem("token") ? "/dashboard" : "/"} className="text-sky-600 hover:text-sky-700 transition duration-150 ease-in-out">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/settings" className="text-neutral-600 transition duration-150 ease-in-out">Settings</Link>
        </div>
        <div className="h-6"></div>
        {/* Page Title */}
        <h1 className="text-3xl font-bold pb-4 px-3 md:px-0">Settings</h1>
        <div className="bg-gray-100 rounded-lg p-10">
          <div className="grid grid-cols-12">
            {/* Side Tabs */}
            <div className="col-span-12 md:col-span-3">
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            {/* Content that shows depending on the tab that is active */}
            <div className="col-span-12 md:col-span-9">
              <div className="bg-white rounded-lg p-10">
                {
                  activeTab === "account-security" ? <AccountSecurity /> : <DeleteAccount />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Settings;