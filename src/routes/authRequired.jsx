import React, { useEffect, useState, useTransition } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

// import useAuthSlice from "./Store/auth-slice";

function AuthRequired() {
    const navigate = useNavigate();
    const [pending, startTransitions] = useTransition();
    const [isAuthentic, setIsAuthentic] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated } = useSelector((state) => state.auth)
    const path = window.location.pathname;

    useEffect(() => {
        setIsLoading(false);
        if (isAuthenticated) {
            setIsAuthentic(true);
        } else {
            startTransitions(() => {
                setIsAuthentic(false);

            });
            return () => {
                null;
            };
        }
    }, [path, isAuthenticated, navigate]);

    return pending ? null : isLoading === false ? (
        isAuthentic ? (
            <Outlet />
        ) : (
            <Navigate to="/login" />
        )
    ) : (
        ""
    );
}

export default AuthRequired;
