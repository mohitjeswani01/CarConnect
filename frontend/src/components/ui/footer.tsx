import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="space-y-5">
                        <Link to="/" className="inline-block">
                            <h2 className="text-2xl font-bold tracking-tight">
                                <span className="text-primary">Car<span className="text-blue-500">Connect</span></span>
                            </h2>
                        </Link>
                        <p className="text-muted-foreground max-w-xs">
                            Premium car rental and carpooling services for a seamless transportation experience.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link to="/carpool" className="text-muted-foreground hover:text-primary transition-colors">
                                    CarPool
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">Services</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Car Rental
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Carpooling
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Premium Cars
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Driver Services
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    24/7 Support
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3">
                                <MapPin size={18} className="text-primary mt-0.5" />
                                <span className="text-muted-foreground">
                                    123 Car Avenue, Mobility City, MC 12345
                                </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone size={18} className="text-primary" />
                                <a
                                    href="tel:+1234567890"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    (123) 456-7890
                                </a>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail size={18} className="text-primary" />
                                <a
                                    href="mailto:info@carconnect.com"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    info@carconnect.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-muted-foreground text-sm">
                        &copy; {new Date().getFullYear()} CarConnect. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Terms of Service
                        </a>
                        <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Cookie Policy
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;