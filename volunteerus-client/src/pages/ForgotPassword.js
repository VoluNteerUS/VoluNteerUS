import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPasswordLink = () => {
    const navigate = useNavigate();
    const handleDone = (e) => {
        e.preventDefault();
        navigate("/login");
    }

    return (
        <>
            <h1 className="font-bold text-2xl">Check your email for reset link</h1>
            <p className="text-sm md:text-base">We have sent a reset password link to your email. Please check your email and follow the instructions to reset your password.</p>
            <button className="block px-4 py-2 mt-4 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-500" onClick={(e) => handleDone(e)}>Done</button>
        </>
    );
}

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [sentEmail, setSentEmail] = useState(false);

    const handleCancel = (e) => {
        e.preventDefault();
        navigate("/login");
    }

    const handleResetPasswordUsingEmail = async (e) => {
        e.preventDefault();
        
        // Clear error
        setError(null);

        // Check if email is empty
        if (email === "") {
            setError("Please enter your email address.");
            return;
        }

        // Check if email is valid
        const passwordRequestURL = new URL("/auth/passwordResetRequest", process.env.REACT_APP_BACKEND_API);
        await axios.post(passwordRequestURL, {
            email: email
        }).then((response) => {
            console.log(response);
            setSentEmail(true);
        }).catch((error) => {
            setError(error.response.data.message);
            console.log(error);
        });
    }


    return (
        <div className="bg-pink-100 h-screen flex items-center justify-center">
            <div className="bg-white rounded-lg sm:w-4/5 md:w-3/4 lg:w-3/5 2xl:w-1/2">
                <div className="flex flex-col p-8">
                    <div className="max-w-2xl mb-4 text-3xl font-serif font-bold tracking-tight leading-none text-darkblue-900 md:text-3xl xl:text-4xl">Forgot Password</div>
                    {
                        sentEmail ? (
                            <ResetPasswordLink />
                        ) : (
                            <>
                                <div className="text-sm md:text-base text-gray-500">Enter your email address to reset your password.</div>
                                {/* Error */}
                                {
                                    error && (
                                        <div className="text-sm md:text-base text-red-500">{error}</div>
                                    )
                                }
                                <div className="flex flex-col mt-4">
                                    <label className="mb-2 font-medium text-lg text-gray-900">Email</label>
                                    <input className="px-4 py-2 border border-gray-300 rounded-md" type="text" placeholder="Enter your NUS email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                {/* Reset Password Button */}
                                <button className="block px-4 py-2 mt-4 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-500" onClick={(e) => handleResetPasswordUsingEmail(e)}>Reset Password</button>
                                {/* Cancel Button */}
                                <button className="block px-4 py-2 mt-4 text-lg font-medium bg-white rounded-lg hover:border-slate-800 border-2 hover:bg-neutral-300" onClick={(e) => handleCancel(e)}>Cancel</button>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;