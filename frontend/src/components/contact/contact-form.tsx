import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const ContactForm = () => {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        subject: "",
        message: ""
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Here you would normally submit the form data to your backend
            console.log('Submitting contact form:', formData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success("Message sent successfully!", {
                description: "We'll get back to you as soon as possible.",
            });

            // Reset form fields except name and email which come from user profile
            setFormData(prev => ({
                ...prev,
                subject: "",
                message: ""
            }));
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message", {
                description: "Please try again later.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm mb-4">
                        Contact Us
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
                        Get in Touch with Our Team
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        We're here to answer any questions you may have about our services. Reach out to us and we'll respond as soon as we can.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                    >
                        <div className="premium-card p-8">
                            <h3 className="text-2xl font-semibold mb-6">Send us a Message</h3>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="full name"
                                        className="premium-input"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="premium-input"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input
                                        id="subject"
                                        placeholder="How can we help you?"
                                        className="premium-input"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Write your message here..."
                                        className="premium-input min-h-[120px]"
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 font-medium transition-all hover:shadow-md text-base"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Sending..." : "Send Message"}
                                    <Send size={16} className="ml-2" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.7 }}
                        className="flex flex-col space-y-8"
                    >
                        <div className="premium-card p-8">
                            <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-blue-600 dark:text-blue-400">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-1">Our Location</h4>
                                        <p className="text-muted-foreground">
                                            123 Car Avenue, Mobility City, MC 12345
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-blue-600 dark:text-blue-400">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-1">Email Us</h4>
                                        <a
                                            href="mailto:info@carconnect.com"
                                            className="text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            info@carconnect.com
                                        </a>
                                        <p className="text-muted-foreground text-sm mt-1">
                                            We'll respond within 24 hours
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-blue-600 dark:text-blue-400">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-1">Call Us</h4>
                                        <a
                                            href="tel:+1234567890"
                                            className="text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            (123) 456-7890
                                        </a>
                                        <p className="text-muted-foreground text-sm mt-1">
                                            Mon-Fri: 8am - 8pm, Sat-Sun: 10am - 6pm
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="premium-card p-8 flex-grow">
                            <h3 className="text-2xl font-semibold mb-6">Our Location</h3>
                            <div className="relative h-[300px] rounded-lg overflow-hidden">
                                {/* This would be replaced with an actual map component in a real application */}
                                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <MapPin size={48} className="mx-auto mb-4 text-blue-600 dark:text-blue-400" />
                                        <p className="text-lg font-medium">Map Placeholder</p>
                                        <p className="text-muted-foreground">
                                            123 Car Avenue, Mobility City, MC 12345
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;