import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

type TestimonialProps = {
    name: string;
    role: string;
    quote: string;
    rating: number;
    image: string;
    delay: number;
};

const Testimonial = ({ name, role, quote, rating, image, delay }: TestimonialProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: delay * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="premium-card p-6 flex flex-col h-full"
        >
            <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={18}
                        className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"}
                    />
                ))}
            </div>
            <p className="text-muted-foreground flex-grow mb-6">"{quote}"</p>
            <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                    <img
                        src={image}
                        alt={name}
                        className="h-full w-full object-cover"
                    />
                </div>
                <div>
                    <p className="font-medium">{name}</p>
                    <p className="text-sm text-muted-foreground">{role}</p>
                </div>
            </div>
        </motion.div>
    );
};

const TestimonialsSection = () => {
    const testimonials = [
        {
            name: "Anjali Jeswani",
            role: "Business Executive",
            quote: "CarConnect has transformed my daily commute. Their premium car rental service is top-notch, with impeccable vehicles and seamless booking.",
            rating: 5,
            image: "https://randomuser.me/api/portraits/women/44.jpg",
            delay: 1,
        },
        {
            name: "Sahil Vidhani",
            role: "Frequent Traveler",
            quote: "I've used many car rental services, but CarConnect stands out with their attention to detail and customer service. Highly recommend!",
            rating: 5,
            image: "https://randomuser.me/api/portraits/men/32.jpg",
            delay: 2,
        },
        {
            name: "simran patel",
            role: "Digital Nomad",
            quote: "The carpooling feature is brilliant! I've saved money and made new connections while reducing my carbon footprint. Win-win-win!",
            rating: 4,
            image: "https://randomuser.me/api/portraits/women/68.jpg",
            delay: 3,
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm mb-4">
                        Customer Testimonials
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
                        What Our Clients Say About Us
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Don't just take our word for it. Here's what our satisfied customers have to say about their experience with CarConnect.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Testimonial
                            key={index}
                            name={testimonial.name}
                            role={testimonial.role}
                            quote={testimonial.quote}
                            rating={testimonial.rating}
                            image={testimonial.image}
                            delay={testimonial.delay}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;