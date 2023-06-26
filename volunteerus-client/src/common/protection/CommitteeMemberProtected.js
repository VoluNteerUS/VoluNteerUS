import { Navigate } from "react-router-dom";
import {useSelector } from "react-redux";

function CommitteeMemberProtected({ children, user }) {
    const token = localStorage.getItem("token");
    const organizationsReducer = useSelector((state) => state.organizations);
    const currentOrganization = organizationsReducer.currentOrganization;
    const committeeMembers = currentOrganization?.committee_members;
    const isCommitteeMember = committeeMembers?.some((committeeMember) => committeeMember._id === user?.id);

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