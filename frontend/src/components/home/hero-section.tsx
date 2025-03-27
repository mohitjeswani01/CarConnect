import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
    return (
        <section className="relative min-h-screen pt-24 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 -z-10" />

            {/* Background pattern */}
            <div className="absolute inset-0 opacity-30 dark:opacity-20 -z-10">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjAyIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00bTAgLTEyYzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNG0tMTIgMGMwLTIuMiAxLjgtNCA0LTRzNCAxLjggNCA0LTEuOCA0LTQgNC00LTEuOC00LTRtLTEyIDBjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00bS0xMiAwYzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNG0xMiAxMmMwLTIuMiAxLjgtNCA0LTRzNCAxLjggNCA0LTEuOCA0LTQgNC00LTEuOC00LTRtLTEyIDBjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00bS0xMiAwYzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNG0xMiAxMmMwLTIuMiAxLjgtNCA0LTRzNCAxLjggNCA0LTEuOCA0LTQgNC00LTEuOC00LTRtLTEyIDBjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-70" />
            </div>

            <div className="container mx-auto px-4 h-full flex flex-col">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center h-full pt-10 pb-20 md:py-20">
                    {/* Hero content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-2xl"
                    >
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm"
                            >
                                The future of mobility
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.7 }}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance"
                            >
                                Premium <span className="text-blue-500">Car Rental</span> & <br />
                                <span className="text-blue-500">Carpooling</span> Solutions
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.7 }}
                                className="text-lg md:text-xl text-muted-foreground max-w-xl"
                            >
                                Experience the freedom of mobility with our premium car rental service
                                and efficient carpooling platform. Your journey, your way.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.7 }}
                                className="flex flex-col sm:flex-row gap-4 pt-4"
                            >
                                <Link to="/signup">
                                    <Button size="lg" className="rounded-lg px-8 text-base h-12 font-medium transition-all duration-300 hover:shadow-lg hover:scale-105">
                                        Get Started
                                        <ArrowRight size={18} className="ml-2" />
                                    </Button>
                                </Link>
                                <Link to="/about">
                                    <Button size="lg" variant="outline" className="rounded-lg px-8 text-base h-12 font-medium">
                                        Learn More
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Hero image */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 1 }}
                        className="hidden lg:block relative"
                    >
                        <div className="relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20"></div>
                            <div className="w-full h-full relative">
                                <img
                                    src="images/curvv.png"
                                    alt="Luxury Car"
                                    className="w-full h-auto rounded-2xl shadow-xl object-cover"
                                />
                            </div>
                        </div>

                        {/* Floating stat card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.7 }}
                            className="absolute -bottom-16 -left-10 glass-morphism rounded-xl p-4 shadow-lg"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="bg-blue-500/10 rounded-lg p-3">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16 3H8C6.89543 3 6 3.89543 6 5V19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19V5C18 3.89543 17.1046 3 16 3Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 18H12.01" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Satisfied Customers</p>
                                    <p className="text-2xl font-bold">10,000+</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating review card */}
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.7 }}
                            className="absolute -top-10 -right-5 glass-morphism rounded-xl p-4 shadow-lg max-w-xs">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                                        MJ
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center space-x-1 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#FFD700" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        "The best car rental service I've ever used. Seamless booking and amazing vehicles!"
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">Mohit Jeswani, verified customer</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;