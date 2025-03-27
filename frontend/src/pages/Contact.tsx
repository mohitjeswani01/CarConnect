import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import ContactForm from "@/components/contact/contact-form";
import SOSButton from "@/components/sos-button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const Contact = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        // Check if user is authenticated using our auth context
        if (!isAuthenticated) {
            toast.error("Authentication Required", {
                description: "Please login or sign up to access the contact page.",
            });
            navigate("/login");
        }
    }, [navigate, isAuthenticated]);

    // If not authenticated, don't render the page content
    if (!isAuthenticated) {
        return null;
    }

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
            <div className="pt-24 bg-blue-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
                        <p className="text-xl text-muted-foreground">
                            Have questions or feedback? Reach out to our team and we'll get back to you as soon as possible.
                        </p>
                    </div>
                </div>
            </div>
            <main>
                <ContactForm />
            </main>
            <Footer />
            <SOSButton />
        </motion.div>
    );
};

export default Contact;