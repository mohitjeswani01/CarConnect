import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const FeaturesSection = () => {
    const features = [
        "Premium vehicle fleet with regular maintenance",
        "Flexible rental periods from hours to weeks",
        "Transparent pricing with no hidden fees",
        "24/7 customer support for assistance",
        "Carpooling options to reduce costs",
        "GPS tracking for added security",
        "Contactless pickup and return",
        "Comprehensive insurance coverage",
        "Multiple pickup and drop-off locations",
        "Mobile app for easy booking and management",
        "Loyalty program with exclusive benefits",
        "Option to book with professional drivers"
    ];

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm mb-4">
                        Why Choose Us
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
                        Features That Set Us Apart
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        We're committed to providing an exceptional mobility experience with features designed for your convenience and peace of mind.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                        className="premium-card p-8 h-full"
                    >
                        <div className="h-full flex flex-col">
                            <h3 className="text-2xl font-bold mb-6">The CarConnect Advantage</h3>
                            <p className="text-muted-foreground mb-8 flex-grow">
                                Our commitment to excellence ensures that every journey with CarConnect is memorable for all the right reasons.
                            </p>
                            <div className="relative h-60 rounded-xl overflow-hidden">
                                <img
                                    src="images/wide.png"
                                    alt="CarConnect Advantage"
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                                    <div className="p-4">
                                        <p className="text-white font-medium">
                                            Premium vehicles for every need
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                        viewport={{ once: true }}
                        className="premium-card p-8 lg:col-span-2"
                    >
                        <h3 className="text-2xl font-bold mb-6">Features & Benefits</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                                    viewport={{ once: true }}
                                    className="flex items-start space-x-3"
                                >
                                    <div className="flex-shrink-0 mt-1 bg-blue-50 dark:bg-blue-900/20 rounded-full p-1">
                                        <Check size={16} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <p>{feature}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
