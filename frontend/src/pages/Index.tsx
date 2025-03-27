import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import HeroSection from "@/components/home/hero-section";
import ServicesSection from "@/components/home/services-section";
import CarShowcase from "@/components/home/car-showcase";
import TestimonialsSection from "@/components/home/testimonials-section";
import CTASection from "@/components/home/cta-section";
import SOSButton from "@/components/sos-button";

const Index = () => {
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
            <main className="overflow-hidden">
                <HeroSection />
                <ServicesSection />
                <CarShowcase />
                <TestimonialsSection />
                <CTASection />
            </main>
            <Footer />
            <SOSButton />
        </motion.div>
    );
};

export default Index;