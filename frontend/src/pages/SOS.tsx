import React from "react";
import { motion } from "framer-motion";
import { Phone, LocateFixed, AlertCircle, MapPin, ArrowLeft } from "lucide-react";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SOS = () => {
    const handleLogout = () => {
        const navigate = useNavigate();
        localStorage.removeItem("userData");
        toast.success("Logged out successfully");
        navigate("/login");
    };

    const handleEmergencyCall = () => {
        toast.success("Emergency call initiated", {
            description: "Help is on the way. Stay calm and safe.",
        });
    };

    const handleShareLocation = () => {
        toast.success("Location shared", {
            description: "Your current location has been shared with emergency services.",
        });
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
            <div className="bg-red-50 dark:bg-red-900/20 pt-24">
                <div className="container mx-auto px-4 py-12">
                    <Link to="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6">
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Safety
                    </Link>

                    <div className="text-center max-w-3xl mx-auto mb-10">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 mb-6">
                            <AlertCircle size={32} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-red-600 dark:text-red-300">Emergency Assistance</h1>
                        <p className="text-xl text-gray-700 dark:text-gray-300">
                            If you're in an emergency situation, we're here to help. Use the options below to get immediate assistance.
                        </p>
                    </div>
                </div>
            </div>

            <main>
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.7 }}
                                className="premium-card p-8 border-red-200 dark:border-red-900/50"
                            >
                                <div className="flex items-center mb-6">
                                    <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-3 text-red-600 dark:text-red-400 mr-4">
                                        <Phone size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold">Emergency Contact</h3>
                                </div>

                                <p className="text-muted-foreground mb-8">
                                    Call our emergency hotline for immediate assistance. Our support team is available 24/7.
                                </p>

                                <Button
                                    variant="destructive"
                                    size="lg"
                                    className="w-full h-14 text-lg font-semibold mb-4"
                                    onClick={handleEmergencyCall}
                                >
                                    <Phone size={20} className="mr-2" />
                                    Call Emergency Support
                                </Button>

                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                                    <h4 className="font-semibold mb-2">Important Numbers</h4>
                                    <ul className="space-y-2">
                                        <li className="flex items-center justify-between">
                                            <span>Police</span>
                                            <a href="tel:911" className="text-blue-600 dark:text-blue-400 font-medium">911</a>
                                        </li>
                                        <li className="flex items-center justify-between">
                                            <span>Ambulance</span>
                                            <a href="tel:911" className="text-blue-600 dark:text-blue-400 font-medium">911</a>
                                        </li>
                                        <li className="flex items-center justify-between">
                                            <span>Roadside Assistance</span>
                                            <a href="tel:18001234567" className="text-blue-600 dark:text-blue-400 font-medium">1-800-123-4567</a>
                                        </li>
                                    </ul>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.7 }}
                                className="premium-card p-8 border-red-200 dark:border-red-900/50"
                            >
                                <div className="flex items-center mb-6">
                                    <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-3 text-red-600 dark:text-red-400 mr-4">
                                        <MapPin size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold">Share Your Location</h3>
                                </div>

                                <p className="text-muted-foreground mb-8">
                                    Share your current location with our emergency response team so we can locate and assist you quickly.
                                </p>

                                <Button
                                    variant="destructive"
                                    size="lg"
                                    className="w-full h-14 text-lg font-semibold mb-4"
                                    onClick={handleShareLocation}
                                >
                                    <LocateFixed size={20} className="mr-2" />
                                    Share Current Location
                                </Button>

                                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mt-6">
                                    <h4 className="font-semibold mb-2 flex items-center">
                                        <AlertCircle size={16} className="mr-2 text-red-500" />
                                        Important Safety Tips
                                    </h4>
                                    <ul className="space-y-2 text-sm">
                                        <li>• Stay in a safe location while waiting for assistance</li>
                                        <li>• Keep your phone charged and with you at all times</li>
                                        <li>• If in a vehicle, turn on hazard lights and use reflectors if available</li>
                                        <li>• In case of medical emergency, try to stay calm and follow dispatcher instructions</li>
                                    </ul>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </motion.div>
    );
};

export default SOS;
