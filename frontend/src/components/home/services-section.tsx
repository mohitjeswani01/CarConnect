import React from "react";
import { motion } from "framer-motion";
import { Car, Users, Clock, Shield, DollarSign, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

type ServiceCardProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay: number;
};

const ServiceCard = ({ icon, title, description, delay }: ServiceCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: delay * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="premium-card p-6 hover:translate-y-[-5px] transition-all duration-300"
        >
            <div className="bg-blue-50 dark:bg-blue-500/10 w-14 h-14 flex items-center justify-center rounded-xl mb-5 text-blue-600 dark:text-blue-400">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </motion.div>
    );
};

const ServicesSection = () => {
    const services = [
        {
            icon: <Car size={28} />,
            title: "Premium Car Rental",
            description: "Choose from our fleet of luxury and reliable vehicles for your perfect journey.",
            delay: 1,
        },
        {
            icon: <Users size={28} />,
            title: "Carpooling",
            description: "Share rides with others heading to the same destination and save on travel costs.",
            delay: 2,
        },
        {
            icon: <Clock size={28} />,
            title: "Flexible Duration",
            description: "Rent a car for hours, days, or weeks with flexible pickup and return options.",
            delay: 3,
        },
        {
            icon: <Shield size={28} />,
            title: "Safety Guaranteed",
            description: "All our vehicles are regularly serviced and sanitized for your safety.",
            delay: 4,
        },
        {
            icon: <DollarSign size={28} />,
            title: "Transparent Pricing",
            description: "No hidden fees or charges. Pay only for what you use with clear pricing.",
            delay: 5,
        },
        {
            icon: <MapPin size={28} />,
            title: "Convenient Locations",
            description: "Multiple pickup and drop-off points available across the city for convenience.",
            delay: 6,
        },
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
                        Our Services
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
                        Premium Transportation Solutions for Every Need
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        We offer a comprehensive range of mobility services designed to make your transportation experience seamless and enjoyable.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <ServiceCard
                            key={index}
                            icon={service.icon}
                            title={service.title}
                            description={service.description}
                            delay={service.delay}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.7 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <Link
                        to="/about"
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                        Learn more about our services
                        <svg
                            className="ml-2"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M5 12H19M19 12L12 5M19 12L12 19"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default ServicesSection;