import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Bell, LogOut, User, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = ({ onLogout }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu when location changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        logout();
        onLogout();
    };

    // Determine if carpool link should be shown
    const shouldShowCarpoolLink = () => {
        // Hide for car rental users
        return !(isAuthenticated && user?.type === 'carRental');
    };

    // Determine dashboard URL based on user type and role
    const getDashboardUrl = () => {
        if (!user) return "/";

        if (user.type === "carRental") {
            switch (user.role) {
                case "owner": return "/car-owner-dashboard";
                case "renter": return "/car-renter-dashboard";
                case "driver": return "/driver-dashboard";
                default: return "/";
            }
        } else if (user.type === "carpool") {
            return "/carpool-dashboard";
        }

        return "/";
    };

    // Filter navLinks based on user type
    const getNavLinks = () => {
        const baseLinks = [
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
            { name: "Contact", path: "/contact" },
        ];

        // Add Carpool link only if it should be shown
        if (shouldShowCarpoolLink()) {
            baseLinks.push({
                name: "CarPool",
                path: "/carpool"
            });
        }

        return baseLinks;
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    // Get filtered nav links
    const navLinks = getNavLinks();

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8",
                isScrolled
                    ? "py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm"
                    : "py-5 bg-transparent"
            )}
        >
            <nav className="container mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center space-x-2 text-2xl font-bold tracking-tight"
                >
                    <span className="text-primary">Car<span className="text-blue-500">Connect</span></span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-1">
                    <ul className="flex space-x-1">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    to={link.path}
                                    className={cn(
                                        "px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-accent",
                                        isActive(link.path)
                                            ? "text-primary bg-accent"
                                            : "text-gray-600 hover:text-primary"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right side buttons */}
                <div className="hidden md:flex items-center space-x-3">
                    <Link to="/sos">
                        <Button
                            variant="destructive"
                            className="rounded-full font-semibold px-6 transition-transform hover:scale-105"
                        >
                            SOS
                        </Button>
                    </Link>

                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar>
                                        <AvatarImage src="" />
                                        <AvatarFallback className="bg-primary text-white">
                                            {user?.name ? user.name.substring(0, 2).toUpperCase() : "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4" />
                                        <Link to={getDashboardUrl()}>Dashboard</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <HelpCircle className="mr-2 h-4 w-4" />
                                        <span>Support</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button
                                    variant="ghost"
                                    className="font-medium transition-colors hover:bg-accent"
                                >
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button
                                    className="font-medium transition-all hover:shadow-md"
                                >
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden text-gray-600 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg animate-fade-in">
                    <div className="container mx-auto py-4 px-6">
                        <ul className="flex flex-col space-y-3">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className={cn(
                                            "block px-4 py-3 rounded-lg font-medium",
                                            isActive(link.path)
                                                ? "text-primary bg-accent"
                                                : "text-gray-600 hover:text-primary hover:bg-accent"
                                        )}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                            <li className="pt-2">
                                <Link to="/sos">
                                    <Button
                                        variant="destructive"
                                        className="w-full rounded-lg font-semibold py-3"
                                    >
                                        SOS Emergency
                                    </Button>
                                </Link>
                            </li>

                            {isAuthenticated ? (
                                <>
                                    <li className="pt-2">
                                        <Link to={getDashboardUrl()}>
                                            <Button className="w-full flex items-center justify-center">
                                                <User size={16} className="mr-2" />
                                                Dashboard
                                            </Button>
                                        </Link>
                                    </li>
                                    <li>
                                        <Button
                                            variant="outline"
                                            className="w-full flex items-center justify-center"
                                            onClick={handleLogout}
                                        >
                                            <LogOut size={16} className="mr-2" />
                                            Log out
                                        </Button>
                                    </li>
                                </>
                            ) : (
                                <li className="pt-2 flex space-x-2">
                                    <Link to="/login" className="w-1/2">
                                        <Button
                                            variant="outline"
                                            className="w-full font-medium"
                                        >
                                            Login
                                        </Button>
                                    </Link>
                                    <Link to="/signup" className="w-1/2">
                                        <Button
                                            className="w-full font-medium"
                                        >
                                            Sign Up
                                        </Button>
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;