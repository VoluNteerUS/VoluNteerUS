import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const AuthVerify = (props) => {
    let location = useLocation();
    const verifyTokenURL = new URL("/auth/verifyToken", process.env.REACT_APP_BACKEND_API);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.get(verifyTokenURL, { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                    let exp = res.data.exp;
                    if (exp * 1000 < Date.now()) {
                        props.logOut();
                    }
                }

            )
        }
    }, [location, props]);

    return;
}

export default AuthVerify;