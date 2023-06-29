import { Navigate } from "react-router-dom";
import {useSelector } from "react-redux";

function CommitteeMemberProtected({ children, user, organization_id }) {
    const token = localStorage.getItem("token");
    const usersReducer = useSelector((state) => state.user);
    const userOrganizations = usersReducer.organizations;
    const isCommitteeMember = userOrganizations?.filter((organization) => 
        organization?._id === organization_id
    ).length > 0;

    if (token && (isCommitteeMember || user?.role === "ADMIN")) {
        return children;
    } else {
        if (token) {
            console.log("Unauthorized");
            return <Navigate to="/unauthorized" replace />;
        } else {
            return <Navigate to="/login" replace />;
        }
    }
}

export default CommitteeMemberProtected;