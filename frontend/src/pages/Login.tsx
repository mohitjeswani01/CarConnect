import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import AuthForm from "@/components/auth/auth-form";
import SOSButton from "@/components/sos-button";

const Login = () => {
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
            <Navbar />
            <div className="pt-24">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center max-w-3xl mx-auto mb-10">
                        <h1 className="text-4xl font-bold mb-6">Car Rental Login</h1>
                        <p className="text-lg text-muted-foreground">
                            Access your account to manage your car rentals, bookings, and more.
                        </p>
                    </div>

                    <AuthForm type="carRental" />
                </div>
            </div>
            <Footer />
            <SOSButton />
        </motion.div>
    );
};

export default Login;