import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import MissionSection from "@/components/about/mission-section";
import FeaturesSection from "@/components/about/features-section";
import TeamSection from "@/components/about/team-section";
import CTASection from "@/components/home/cta-section";
import SOSButton from "@/components/sos-button";

const About = () => {
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
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">About CarConnect</h1>
                        <p className="text-xl text-muted-foreground">
                            Your premium destination for car rentals and carpooling services. Learn more about our mission, values, and the team behind CarConnect.
                        </p>
                    </div>
                </div>
            </div>
            <main>
                <MissionSection />
                <FeaturesSection />
                <TeamSection />
                <CTASection />
            </main>
            <Footer />
            <SOSButton />
        </motion.div>
    );
};

export default About;