import { useSelector } from "react-redux";
import axios from "axios";

function AdminVisible({ children }) {
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

    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated && user?.role === "ADMIN") {
        return children;
    } else {
        return null;
    }
}

export default AdminVisible;