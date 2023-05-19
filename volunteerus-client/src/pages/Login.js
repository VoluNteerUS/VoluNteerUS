import React, { useState } from "react";
import image from "../images/helping-hand.jpg";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";

function Login() {
    const [state, setState] = useState(
        {
            email: "",
            password: "",
            error: "",
        }
    );

    const handleLogin = async (event) => {
        event.preventDefault();
        // Clear error
        setState({ ...state, error: "" });
        const requestBody = {
            email : state.email,
            password : state.password 
        };

        await axios.post("http://localhost:5000/auth/login", requestBody).then((response) => {
            console.log(response.data);
            // Go to home page
            window.location.href = "/";
        }).catch((error) => {
            console.log(error.response.data.message);
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

    return (
        <div className="bg-pink-100">
            <div className="flex items-center h-screen justify-center">
                <div className="bg-white rounded-lg md:w-3/4 lg:w-3/5 2xl:w-1/2">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-8 p-12 mx-4 mt-4 mb-12">
                            <h1 className="max-w-2xl mb-4 text-3xl font-serif font-bold tracking-tight leading-none text-darkblue-900 md:text-3xl xl:text-4xl">Log In</h1>
                            <p className="text-sm">Log in to your account to start exploring volunteering opportunities!</p>
                            <form onSubmit={ handleLogin }>
                                <div className="flex flex-col mt-4">
                                    <label className="mb-2 font-medium text-lg text-gray-900">Email</label>
                                    <input className="px-4 py-2 border border-gray-300 rounded-md" type="text" placeholder="Enter your email address" onChange={ e => {setState({...state, email: e.target.value}); }} />
                                </div>
                                <div className="flex flex-col mt-4">
                                    <label className="mb-2 font-medium text-lg text-gray-900">Password</label>
                                    <input className="px-4 py-2 border border-gray-300 rounded-md" type="password" placeholder="Enter your password" onChange={ e => {setState({...state, password: e.target.value}); }} />
                                </div>
                                { errorMessage }
                                <div className="flex items-center justify-between mt-4">
                                    <a href="#" className="text-marine-500 hover:underline">Forgot Password?</a>
                                    <button className="block w-1/4 px-4 py-2 mt-4 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-800">Log in</button>
                                </div>
                                <div className="flex items-center justify-center mt-8 p-8">
                                    <span>Don’t have an account yet?&nbsp;</span>
                                    <a href="#" className="text-marine-500 hover:underline">Sign up!</a>
                                </div>
                            </form>
                        </div>
                        <div className="hidden md:block md:visible md:col-span-4">
                            <div className="relative h-full">
                                <img src={image} alt="asthetic" className="h-full rounded-r-lg"/>
                                <a href="#" className="absolute top-4 right-4 p-4 rounded-full bg-white/70 hover:bg-slate-500">
                                    <XMarkIcon className="w-6 h-6 text-gray-700" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
