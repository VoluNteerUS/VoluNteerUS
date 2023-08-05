import { useLocation } from 'react-router-dom';

const useNavbarVisibility = () => {
    const location = useLocation();
    const noNavbarRoutes = [
        "/login",
        "/register",
        "/setup",
        "/forgotPassword",
        "/passwordReset",
        "/unauthorized",
        "/404",
    ];

    const isNavbarVisible = !noNavbarRoutes.includes(location.pathname);
    return isNavbarVisible;
};

export default useNavbarVisibility;