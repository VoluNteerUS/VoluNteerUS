import { useSelector } from "react-redux";

function AdminVisible({ children }) {
    const { user } = useSelector(state => state.user);
    const token = localStorage.getItem("token");

    if (token && user?.role === "ADMIN") {
        return children;
    } else {
        return null;
    }
}

export default AdminVisible;