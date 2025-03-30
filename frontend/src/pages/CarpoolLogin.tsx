import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import AuthForm from "@/components/auth/auth-form";
import SOSButton from "@/components/sos-button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CarpoolLogin = () => {

    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("userData");
        toast.success("Logged out successfully");
        navigate("/login");
    };
    // Page transition
    const pageVariants = {
        initial: {
            opacity: 0,
        },
        in: {
            opacity: 1,
        },
        out: {
            opacity: 0,
        },
    };

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ duration: 0.5 }}
        >
            <Navbar onLogout={handleLogout} />
            <div className="pt-24">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center max-w-3xl mx-auto mb-10">
                        <h1 className="text-4xl font-bold mb-6">Carpool Login</h1>
                        <p className="text-lg text-muted-foreground">
                            Access your account to find or offer rides through our carpooling service.
                        </p>
                    </div>

                    <AuthForm type="carpool" />
                </div>
            </div>
            <Footer />
            <SOSButton />
        </motion.div>
    );
};

export default CarpoolLogin;