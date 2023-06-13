import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function AdminProtected({ children }) {
    const { user } = useSelector(state => state.user);
    const token = localStorage.getItem("token");

    if (token && user?.role === "ADMIN") {
        return children;
    } else {
        return <Navigate to="/login" replace />;
    }
}

export default AdminProtected;