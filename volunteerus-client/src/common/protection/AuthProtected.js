import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function AuthProtected({ children }) {
    const verifyTokenURL = new URL("/auth/verifyToken", process.env.REACT_APP_BACKEND_API);
    const token = localStorage.getItem("token");

    if (token) {
        axios.get(verifyTokenURL, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                localStorage.setItem("isAuthenticated", true);
            })
            .catch((err) => {
                localStorage.setItem("isAuthenticated", false);
            });
    } else {
        localStorage.setItem("isAuthenticated", false);
    }

    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    if (isAuthenticated) {
        return children;
    } else {
        return <Navigate to="/login" replace />;
    }
}

export default AuthProtected;