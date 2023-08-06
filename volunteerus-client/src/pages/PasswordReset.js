import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api-service';

function PasswordReset() {
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    const [state, setState] = useState(
        {
            token: searchParams.get("token"),
            email: searchParams.get("email"),
            newPassword: "",
            confirmNewPassword: "",
        }
    );
    const [errorMessage, setErrorMessage] = useState(null);

    const handlePasswordReset = async (event) => {
        event.preventDefault();

        // Clear error
        setErrorMessage(null);

        // Validate new password if it meets requirements
        if (state.newPassword === "") {
            setErrorMessage("Please enter your new password.");
            return;
        }

        if (state.confirmNewPassword === "") {
            setErrorMessage("Please confirm your new password.");
            return;
        }

        // Check if password is at least 10 characters long with upper and lower case letters and numbers
        if (!state.newPassword.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{10,}$/)) {
            setErrorMessage("Password must be at least 10 characters long and contain at least one upper case letter, one lower case letter and one number");
            return;
        }

        if (state.newPassword !== state.confirmNewPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        // Send request to reset password
        await api.resetPassword({  
            token: state.token,
            email: state.email,
            new_password: state.newPassword,
            confirm_new_password: state.confirmNewPassword
        }).then((response) => {
            navigate("/login");
        }).catch((error) => {
            setErrorMessage(error.response.data.message);
        });
    }

    return (
        <div className="bg-pink-100">
            <div className="flex items-center h-screen justify-center">
                <div className="bg-white rounded-lg sm:w-3/4 md:w-3/5 lg:w-1/2 2xl:w-2/5">
                    <div className="p-12 mx-4 mt-4 mb-12">
                        <h1 className="max-w-2xl mb-4 text-3xl font-serif font-bold tracking-tight leading-none text-darkblue-900 md:text-3xl xl:text-4xl">Reset Password</h1>
                        <p className="text-sm"></p>
                        <form onSubmit={handlePasswordReset}>
                            <div className="flex flex-col mt-4">
                                <label className="mb-2 font-medium text-lg text-gray-900">New Password</label>
                                <input className="px-4 py-2 border border-gray-300 rounded-md" type="password" placeholder="New Password" onChange={e => { setState({ ...state, newPassword: e.target.value }); }} />
                            </div>
                            <div className="flex flex-col mt-4">
                                <label className="mb-2 font-medium text-lg text-gray-900">Confirm New Password</label>
                                <input className="px-4 py-2 border border-gray-300 rounded-md" type="password" placeholder="Confirm New Password" onChange={e => { setState({ ...state, confirmNewPassword: e.target.value }); }} />
                            </div>
                            { 
                                errorMessage && (
                                    <div className="flex items-center py-3" role="alert">
                                        <p className="text-danger-600 text-sm">{errorMessage}</p>
                                    </div>
                                )
                            }
                            <div className="flex items-center justify-between mt-4">
                                <button className="block w-1/4 px-4 py-2 mt-4 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-500">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PasswordReset;