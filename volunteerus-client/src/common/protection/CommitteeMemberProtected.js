import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

function CommitteeMemberProtected({ children }) {
    const { user } = useSelector((state) => state.user);
    const currentOrganization = useSelector((state) => state.organizations.currentOrganization);
    const verifyTokenURL = new URL("/auth/verifyToken", process.env.REACT_APP_BACKEND_API);
    const token = localStorage.getItem("token");
    const [committeeMembers, setCommitteeMembers] = useState([]);

    useEffect(() => {
        const getCommitteeMembers = async () => {
            const committeeMemberURL = new URL(`/committeeMembers?organization_id=${currentOrganization._id}`, process.env.REACT_APP_BACKEND_API);
            const committeeMembers = await axios.get(committeeMemberURL);
            setCommitteeMembers(committeeMembers.data);
        }
        getCommitteeMembers();
    }, [currentOrganization._id]);


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
    const isCommitteeMember = committeeMembers.some((committeeMember) => committeeMember.user_id === user?._id);

    if (isAuthenticated && isCommitteeMember) {
        console.log("Authorized");
        return children;
    } else {
        if (isAuthenticated) {
            console.log("Unauthorized");
            return <Navigate to="/unauthorized" replace />;
        } else {
            return <Navigate to="/login" replace />;
        }
    }
}

export default CommitteeMemberProtected;