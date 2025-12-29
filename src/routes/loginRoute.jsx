import { useSelector } from "react-redux";
import Auth from "@/pages/authentication/Auth";
import { Navigate } from "react-router-dom";

const LoginRoute = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    return isAuthenticated ? <Navigate to="/home" /> : <Auth />;
};

export default LoginRoute;
