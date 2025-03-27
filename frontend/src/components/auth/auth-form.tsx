import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, MapPin, Phone, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface AuthFormProps {
    type: "carRental" | "carpool";
}

const AuthForm = ({ type }: AuthFormProps) => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [userType, setUserType] = useState(type === "carRental" ? "renter" : "user");
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        phone: "",
        license: "",
    });
    const navigate = useNavigate();
    const { login, register, isAuthenticated } = useAuth();

    // If user is already logged in, redirect to appropriate dashboard
    useEffect(() => {
        if (isAuthenticated) {
            console.log('User is already authenticated, redirecting to dashboard');
            redirectToDashboard();
        }
    }, [isAuthenticated]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            console.log('Form submission initiated:', isLogin ? 'Login' : 'Register');

            if (isLogin) {
                // Login
                console.log('Logging in with email:', formData.email);
                const success = await login(formData.email, formData.password);

                if (success) {
                    console.log('Login successful, redirecting to dashboard');
                    // Redirect to appropriate dashboard
                    redirectToDashboard();
                }
            } else {
                // Register
                const userData = {
                    ...formData,
                    role: userType,
                    type: type
                };

                console.log('Registering with data:', { ...userData, password: '********' });
                const success = await register(userData);

                if (success) {
                    console.log('Registration successful, redirecting to dashboard');
                    // Redirect to appropriate dashboard
                    redirectToDashboard();
                }
            }
        } catch (error) {
            console.error("Authentication error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const redirectToDashboard = () => {
        console.log('Redirecting to dashboard. User type:', type, 'User role:', userType);

        // Short delay to ensure state updates have completed
        setTimeout(() => {
            // Redirect based on user type
            if (type === "carRental") {
                switch (userType) {
                    case "owner":
                        navigate("/car-owner-dashboard");
                        break;
                    case "renter":
                        navigate("/car-renter-dashboard");
                        break;
                    case "driver":
                        navigate("/driver-dashboard");
                        break;
                    default:
                        navigate("/");
                        break;
                }
            } else if (type === "carpool") {
                navigate("/carpool-dashboard");
            } else {
                // Fallback
                console.warn('Unknown user type for redirection');
                navigate("/");
            }
        }, 500);
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        // Reset form data when toggling between login and register
        setFormData({
            name: "",
            email: "",
            password: "",
            address: "",
            phone: "",
            license: "",
        });
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="premium-card p-8"
            >
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold">
                        {isLogin ? "Welcome Back" : "Create an Account"}
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        {isLogin
                            ? "Sign in to access your account"
                            : "Join us for a premium mobility experience"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        placeholder="full name"
                                        className="pl-10 premium-input"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                className="pl-10 premium-input"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10 premium-input"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {!isLogin && (
                        <>
                            {type === "carRental" && (
                                <div className="space-y-3">
                                    <Label>User Type</Label>
                                    <RadioGroup
                                        defaultValue={userType}
                                        onValueChange={setUserType}
                                        className="flex flex-col space-y-1"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="renter" id="renter" />
                                            <Label htmlFor="renter" className="cursor-pointer">Car Renter</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="owner" id="owner" />
                                            <Label htmlFor="owner" className="cursor-pointer">Car Owner</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="driver" id="driver" />
                                            <Label htmlFor="driver" className="cursor-pointer">Driver</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            )}

                            {userType === "owner" && (
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="address"
                                            placeholder="123 Main St, City"
                                            className="pl-10 premium-input"
                                            value={formData.address}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            )}

                            {(userType === "driver" || userType === "owner") && (
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            className="pl-10 premium-input"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            )}

                            {userType === "driver" && (
                                <div className="space-y-2">
                                    <Label htmlFor="license">Driver's License</Label>
                                    <div className="relative">
                                        <Car className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="license"
                                            placeholder="License Number"
                                            className="pl-10 premium-input"
                                            value={formData.license}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <Button
                        type="submit"
                        className="w-full h-11 font-medium transition-all hover:shadow-md text-base"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? "Processing..."
                            : isLogin
                                ? "Sign In"
                                : "Create Account"}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={toggleForm}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
                    >
                        {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthForm;