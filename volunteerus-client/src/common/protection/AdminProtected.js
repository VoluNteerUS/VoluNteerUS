import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import axios from "axios";

function AdminProtected({ children }) {
    const { user } = useSelector(state => state.user);
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

    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated && user?.role === "ADMIN") {
        return children;
    } else {
        return <Navigate to="/login" replace />;
    }
}

export default AdminProtected;