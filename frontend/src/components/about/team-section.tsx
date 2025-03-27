import React from "react";
import { motion } from "framer-motion";
import { Linkedin, Twitter, Mail } from "lucide-react";

type TeamMemberProps = {
    name: string;
    role: string;
    image: string;
    delay: number;
};

const TeamMember = ({ name, role, image, delay }: TeamMemberProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: delay * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="premium-card overflow-hidden group"
        >
            <div className="relative overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-80 object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6 w-full">
                        <div className="flex justify-center space-x-4">
                            <a href="#" className="text-white hover:text-blue-300 transition-colors">
                                <Linkedin size={20} />
                            </a>
                            <a href="#" className="text-white hover:text-blue-300 transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-white hover:text-blue-300 transition-colors">
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-semibold">{name}</h3>
                <p className="text-muted-foreground">{role}</p>
            </div>
        </motion.div>
    );
};

const TeamSection = () => {
    const team = [
        {
            name: "Sahil Ahuja",
            role: "CEO & Founder",
            image: "images/sahil.png",
            delay: 1,
        },
        {
            name: "Mohit Jeswani",
            role: "Head of Operations",
            image: "images/mohitt.png",
            delay: 2,
        },
        {
            name: "Harsh Vidhani",
            role: "Fleet Manager",
            image: "images/harsh.png",
            delay: 3,
        },
        {
            name: "Kaivalya Patil",
            role: "Customer Relations",
            image: "images/kaivalya.png",
            delay: 4,
        },
    ];

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm mb-4">
                        Our Team
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
                        Meet the People Behind CarConnect
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Our dedicated team of professionals works tirelessly to ensure that we deliver the best possible experience for our customers.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {team.map((member, index) => (
                        <TeamMember
                            key={index}
                            name={member.name}
                            role={member.role}
                            image={member.image}
                            delay={member.delay}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;