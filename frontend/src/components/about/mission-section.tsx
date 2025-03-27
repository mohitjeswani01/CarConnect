import React from "react";
import { motion } from "framer-motion";
import { Award, Shield, Users, Clock } from "lucide-react";

const MissionSection = () => {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm mb-4">
                            Our Mission
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
                            Redefining Transportation Through Innovation
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            At CarConnect, we're committed to revolutionizing the way people think about transportation. We believe in creating a world where mobility is accessible, efficient, and sustainable.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-blue-600 dark:text-blue-400">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Excellence in Service</h3>
                                    <p className="text-muted-foreground">
                                        We're dedicated to providing exceptional experiences through meticulous attention to detail and personalized service.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-blue-600 dark:text-blue-400">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Safety First Approach</h3>
                                    <p className="text-muted-foreground">
                                        Your safety is our top priority. We maintain rigorous standards for vehicle maintenance and driver verification.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-blue-600 dark:text-blue-400">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Community Building</h3>
                                    <p className="text-muted-foreground">
                                        We're creating a community of drivers and passengers who share a commitment to efficient, responsible transportation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20"></div>
                        <div className="relative rounded-2xl overflow-hidden shadow-xl">
                            <img
                                src="https://images.unsplash.com/photo-1562126428-c6aa0c176aac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                                alt="Mission"
                                className="w-full h-auto rounded-2xl"
                            />
                        </div>

                        {/* Floating stat card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.7 }}
                            viewport={{ once: true }}
                            className="absolute -bottom-10 -left-10 glass-morphism rounded-xl p-4 shadow-lg"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="bg-blue-500/10 rounded-lg p-3">
                                    <Clock size={24} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Years of Excellence</p>
                                    <p className="text-2xl font-bold">10+</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default MissionSection;