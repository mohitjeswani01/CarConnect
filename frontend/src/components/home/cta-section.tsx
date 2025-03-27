import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="relative rounded-2xl overflow-hidden">
                    {/* Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 -z-10" />

                    {/* Pattern overlay */}
                    <div className="absolute inset-0 opacity-10 -z-10">
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#smallGrid)" />
                        </svg>
                    </div>

                    <div className="p-8 md:p-12 lg:p-16">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7 }}
                                viewport={{ once: true }}
                                className="text-white"
                            >
                                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
                                    Ready to Experience Premium Mobility Solutions?
                                </h2>
                                <p className="text-lg text-blue-100 mb-8 max-w-xl">
                                    Join thousands of satisfied customers who've chosen CarConnect for their transportation needs. Sign up today and get access to exclusive offers.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link to="/signup">
                                        <Button size="lg" variant="secondary" className="rounded-lg px-8 text-base h-12 font-medium bg-white text-blue-600 hover:bg-blue-50 border-none shadow-lg">
                                            Get Started
                                            <ArrowRight size={18} className="ml-2" />
                                        </Button>
                                    </Link>
                                    <Link to="/contact">
                                        <Button size="lg" variant="outline" className="rounded-lg px-8 text-base h-12 font-medium text-white border-white hover:bg-blue-600/20">
                                            Contact Us
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.7 }}
                                viewport={{ once: true }}
                                className="flex items-center justify-center lg:justify-end"
                            >
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 max-w-md w-full">
                                    <div className="space-y-4">
                                        <div className="bg-white/10 rounded-lg p-3">
                                            <div className="flex items-center space-x-4">
                                                <div className="bg-white/15 rounded-full p-2 text-white">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="currentColor" />
                                                    </svg>
                                                </div>
                                                <div className="text-white">
                                                    <p className="font-medium">Quick Registration</p>
                                                    <p className="text-sm text-blue-100">Create an account in just minutes</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/10 rounded-lg p-3">
                                            <div className="flex items-center space-x-4">
                                                <div className="bg-white/15 rounded-full p-2 text-white">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="currentColor" />
                                                    </svg>
                                                </div>
                                                <div className="text-white">
                                                    <p className="font-medium">Seamless Booking</p>
                                                    <p className="text-sm text-blue-100">Book your rides with just a few clicks</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/10 rounded-lg p-3">
                                            <div className="flex items-center space-x-4">
                                                <div className="bg-white/15 rounded-full p-2 text-white">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="currentColor" />
                                                    </svg>
                                                </div>
                                                <div className="text-white">
                                                    <p className="font-medium">Premium Experience</p>
                                                    <p className="text-sm text-blue-100">Enjoy luxury vehicles and top-notch service</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;