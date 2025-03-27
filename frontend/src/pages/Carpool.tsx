import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const Carpool = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, isInitialized } = useAuth();
    const [redirected, setRedirected] = useState(false);

    useEffect(() => {
        // Prevent multiple redirects
        if (redirected) return;

        // Only proceed if auth is initialized
        if (!isInitialized) return;

        // Clear logic: immediately redirect based on user type
        if (isAuthenticated) {
            if (user?.type === 'carpool') {
                console.log('Carpool user detected, redirecting to dashboard');
                navigate("/carpool-dashboard");
            } else {
                // Any other type of user (car rental)
                console.log('Non-carpool user detected, redirecting to carpool login');
                toast.info("Carpool Account Required", {
                    description: "Please log in with a carpool account to access this feature.",
                });
                navigate("/carpool-login");
            }
        } else {
            // Not authenticated at all
            console.log('User not authenticated, redirecting to carpool login');
            navigate("/carpool-login");
        }

        setRedirected(true);
    }, [navigate, isAuthenticated, user, isInitialized, redirected]);

    // Return null to prevent any rendering while redirecting
    return null;
};

export default Carpool;
