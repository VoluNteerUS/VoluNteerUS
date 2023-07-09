import React, { useState }  from "react";
import image from "../assets/illustrations/standing_human.svg";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, setUserOrganizations } from "../actions/userActions";

function Register() {
    const [state, setState] = useState(
        {
            "email" : "",
            "full_name" : "",
            "password" : "",
            "confirm_password" : "",
            "error" : "",
            "isAuthenticated" : localStorage.getItem("token") ? true : false
        }
    );

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleRegister = async (event) => {
        // Prevent default behaviour
        event.preventDefault();

        // Clear error
        setState({ ...state, error: "" });

        // Check for empty fields
        if (state.email === "" || state.full_name === "" || state.password === "" || state.confirm_password === "") {
            setState({ ...state, error: "Please fill in all fields" });
            return;
        }

        // Check if email is valid
        if (!state.email.includes("@")) {
            setState({ ...state, error: "Please enter a valid email address" });
            return;
        }

        if (!state.email.includes("nus.edu")) {
            setState({ ...state, error: "Please enter a NUS email address" })
            return;
        }

        // Check if password is at least 10 characters long with upper and lower case letters and numbers
        if (!state.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{10,}$/)) {
            setState({ ...state, error: "Password must be at least 10 characters long and contain at least one upper case letter, one lower case letter and one number" });
            return;
        }
        
        // Check if passwords match
        if (state.password !== state.confirm_password) {
            setState({ ...state, error: "Passwords do not match" });
            return;
        }

        // Send request to server
        const requestBody = {
            email : state.email,
            full_name : state.full_name,
            password : state.password
        };

        // Endpoint for registering a user
        const registerURL = new URL("/users", process.env.REACT_APP_BACKEND_API);
        const loginURL = new URL("/auth/login", process.env.REACT_APP_BACKEND_API);

        await axios.post(registerURL, requestBody).then(async (response) => {
            // Save user data to redux store
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

            // Get user's organizations
            const getUserOrganizationsURL = new URL(`/organizations/getUserOrganizations`, process.env.REACT_APP_BACKEND_API);
            const getUserOrganizationRequestBody = {
                userId: user._id
            };
            const userOrganizationsRes = await axios.post(getUserOrganizationsURL, getUserOrganizationRequestBody);
            // Save user's organizations to redux store
            if (userOrganizationsRes.data) {
                dispatch(setUserOrganizations(userOrganizationsRes.data));
            }

            // Log in user and store token in local storage
            const loginRequestBody = {
                email : state.email,
                password : state.password
            };

            await axios.post(loginURL, loginRequestBody).then((response) => {
                localStorage.setItem("token", response.data["access_token"]);
                // Redirect to set up profile page
                navigate("/setup");
            });
        }).catch((error) => {
            console.log(error);
            setState({ ...state, error: error.response.data.message });
        });
    }

    let errorMessage = null;
    if (state.error) {
        errorMessage = (
            <div className="flex items-center py-3" role="alert">
                <p className="text-danger-600 text-sm">{ state.error }</p>
            </div>
        );
    }

    if (state.isAuthenticated) {
        return <Navigate to="/" replace />;
    } else {
        return (
            <div className="bg-pink-100">
                <div className="flex items-center h-screen justify-center">
                    <div className="bg-white rounded-lg md:w-3/4 lg:w-3/5 2xl:w-1/2">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 xl:col-span-8 px-8 sm:px-12 xl:py-2 mx-0 sm:mx-4 mt-8">
                                <h1 className="max-w-2xl mb-4 text-3xl font-serif font-bold tracking-tight leading-none text-darkblue-900 sm:text-2xl md:text-3xl xl:text-4xl">Create your account</h1>
                                <p className="text-xs sm:text-sm">Create your account to start your volunteering journey!</p>
                                <form onSubmit={ handleRegister }>
                                    <div className="flex flex-col mt-4">
                                        <label className="mb-2 font-medium text-sm sm:text-base md:text-lg text-gray-900">Email</label>
                                        <input className="px-4 py-2 border border-gray-300 rounded-md text-sm sm:text-base md:text-lg" type="text" placeholder="Enter your NUS email address" onChange={ e => {setState({...state, email: e.target.value}); }} />
                                    </div>
                                    <div className="flex flex-col mt-4">
                                        <label className="mb-2 font-medium text-sm sm:text-base md:text-lg text-gray-900">Full Name</label>
                                        <input className="px-4 py-2 border border-gray-300 rounded-md text-sm sm:text-base md:text-lg" type="text" placeholder="Enter your full name" onChange={ e => {setState({...state, full_name: e.target.value}); }} />
                                    </div>
                                    <div className="flex flex-col mt-4">
                                        <label className="mb-2 font-medium text-sm sm:text-base md:text-lg text-gray-900">Password</label>
                                        <input className="px-4 py-2 border border-gray-300 rounded-md text-sm sm:text-base md:text-lg" type="password" placeholder="Type to create a password" onChange={ e => {setState({...state, password: e.target.value}); }} />
                                        <p className="text-xs text-gray-700 pt-2">Requirement: At least 10 characters long with a combination of uppercase letters, lowercase letters and numbers.</p>
                                    </div>
                                    <div className="flex flex-col mt-4">
                                        <label className="mb-2 font-medium text-sm sm:text-base md:text-lg text-gray-900">Confirm Password</label>
                                        <input className="px-4 py-2 border border-gray-300 rounded-md text-sm sm:text-base md:text-lg" type="password" placeholder="Retype the password you created above" onChange={ e => {setState({...state, confirm_password: e.target.value}); }} />
                                    </div>
                                    { errorMessage }
                                    <div className="flex items-center justify-end mt-4">
                                        <button className="block w-1/3 sm:w-1/4 xl:w-1/3 px-4 py-2 mt-4 text-sm sm:text-base md:text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-500">Sign Up</button>
                                    </div>
                                    <div className="flex items-center justify-center mt-6 p-6 text-sm sm:text-base">
                                        <span>Already have an account?&nbsp;</span>
                                        <Link to="/login" className="text-marine-500 hover:underline">Sign In</Link>
                                    </div>
                                </form>
                            </div>
                            <div className="hidden xl:block xl:visible xl:col-span-4">
                                <div className="relative h-full">
                                    <div className="h-full flex items-center justify-center w-3/4">
                                        <img src={image} alt="asthetic" />
                                    </div>
                                    <Link to="/" className="absolute top-4 right-4 p-4 rounded-full bg-secondary-400 hover:bg-slate-500">
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
};

export default Register;