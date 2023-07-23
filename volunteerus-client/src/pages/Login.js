import React, { useState } from "react";
import image from "../assets/images/helping-hand.jpg";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { Link } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, setUserOrganizations } from "../actions/userActions";

function Login() {
    const [state, setState] = useState(
        {
            isAuthenticated: localStorage.getItem("token") ? true : false,
            email: "",
            password: "",
            error: "",
        }
    );

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (event) => {
        event.preventDefault();
        // Clear error
        setState({ ...state, error: "" });
        const requestBody = {
            email: state.email,
            password: state.password
        };

        // Endpoint for logging in a user
        const loginURL = new URL("/auth/login", process.env.REACT_APP_BACKEND_API);
        // Endpoint for getting user profile
        const profileURL = new URL("/auth/profile", process.env.REACT_APP_BACKEND_API);

        await axios.post(loginURL, requestBody).then((response) => {
            // Save token to local storage
            localStorage.setItem("token", response.data["access_token"]);
            // Get user from token
            axios.get(profileURL, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }).then(async (response) => {
                // Save user to redux store
                console.log(response.data);
                localStorage.setItem("full_name", response.data["full_name"]);
                let user = response.data;
                dispatch(setUser({
                    email: user.email,
                    full_name: user.full_name,
                    id: user._id,
                    role: user.role,
                    registered_on: user.registered_on,
                    profile_picture: user.profile_picture,
                    phone_number: user.phone_number,
                    telegram_handle: user.telegram_handle,
                    faculty: user.faculty,
                    major: user.major,
                    year_of_study: user.year_of_study,
                    dietary_restrictions: user.dietary_restrictions,
                }))
                // If user is admin, redirect to admin dashboard
                if (user.role === "ADMIN") {
                    navigate("/admin", { replace: true });
                } else {
                    // Get user's organizations
                    const getUserOrganizationsURL = new URL("/organizations/getUserOrganizations", process.env.REACT_APP_BACKEND_API);
                    const getUserOrganizationRequestBody = {
                        userId: user._id
                    };
                    const userOrganizationsRes = await axios.post(getUserOrganizationsURL, getUserOrganizationRequestBody);

                    // Save user's organizations to redux store
                    if (userOrganizationsRes.data) {
                        dispatch(setUserOrganizations(userOrganizationsRes.data));
                    }
                    // console.log(userOrganizationsRes)
                    // Else, redirect to for you page
                    navigate("/dashboard", { replace: true });
                }
            }).catch((error) => {
                console.log(error.response.data.message);
                setState({ ...state, error: error.response.data.message });
            });
        }).catch((error) => {
            console.log(error.response.data.message);
            setState({ ...state, error: error.response.data.message });
        });
    }

    let errorMessage = null;
    if (state.error) {
        errorMessage = (
            <div className="flex items-center py-3" role="alert">
                <p className="text-danger-600 text-sm">{state.error}</p>
            </div>
        );
    }

    if (state.isAuthenticated) {
        return <Navigate to="/" replace />;
    } else {
        return (
            <div className="bg-pink-100">
                <div className="flex items-center h-screen justify-center">
                    <div className="bg-white rounded-lg mx-3 sm:mx-0 sm:w-4/5 md:w-3/4 lg:w-3/5 2xl:w-1/2">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 md:col-span-8 py-6 px-3 sm:p-8 md:p-12 mx-4 mt-4 mb-12">
                                <h1 className="max-w-2xl mb-4 text-3xl font-serif font-bold tracking-tight leading-none text-darkblue-900 md:text-3xl xl:text-4xl">Log In</h1>
                                <p className="text-sm">Log in to your account to start exploring volunteering opportunities!</p>
                                <form onSubmit={handleLogin}>
                                    <div className="flex flex-col mt-4">
                                        <label className="mb-2 font-medium md:text-lg text-gray-900">Email</label>
                                        <input className="px-4 py-2 border border-gray-300 rounded-md" type="text" placeholder="Enter your NUS email address" onChange={e => { setState({ ...state, email: e.target.value }); }} />
                                    </div>
                                    <div className="flex flex-col mt-4">
                                        <label className="mb-2 font-medium md:text-lg text-gray-900">Password</label>
                                        <input className="px-4 py-2 border border-gray-300 rounded-md" type="password" placeholder="Enter your password" onChange={e => { setState({ ...state, password: e.target.value }); }} />
                                    </div>
                                    {errorMessage}
                                    <div className="flex items-center justify-between mt-4">
                                        <Link to="/forgotPassword" className="text-marine-500 hover:underline text-sm md:text-base">Forgot Password?</Link>
                                        <button className="block sm:w-1/4 px-4 py-2 mt-4 md:text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-500">Log in</button>
                                    </div>
                                    <div className="flex items-center justify-center mt-8 md:p-6 lg:p-8 text-sm md:text-base">
                                        <p>
                                            <span>Don’t have an account yet?&nbsp;</span>
                                            <Link to="/register" className="text-marine-500 hover:underline">Sign up!</Link>          
                                        </p>
                                    </div>
                                </form>
                            </div>
                            <div className="hidden md:block md:visible md:col-span-4">
                                <div className="relative h-full">
                                    <img src={image} alt="asthetic" className="h-full rounded-r-lg" />
                                    <Link to="/" className="absolute top-4 right-4 p-4 rounded-full bg-white/70 hover:bg-slate-500">
                                        <XMarkIcon className="w-6 h-6 text-gray-700" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;