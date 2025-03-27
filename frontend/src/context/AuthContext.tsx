import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/services/api';
import { toast } from 'sonner';

type UserData = {
    isLoggedIn: boolean;
    type: 'carRental' | 'carpool';
    role?: 'owner' | 'renter' | 'driver' | 'user';
    token: string;
    name?: string;
    email?: string;
};

type AuthContextType = {
    user: UserData | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (userData: any) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    isInitialized: boolean;
    getUserProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    useEffect(() => {
        const initAuth = async () => {
            // Check if the user is already logged in
            const storedUserData = localStorage.getItem('userData');

            if (storedUserData) {
                try {
                    console.log('Found stored user data, restoring session');
                    const parsedData = JSON.parse(storedUserData);
                    setUser(parsedData);
                    setIsAuthenticated(parsedData.isLoggedIn || false);

                    // Optional: Verify token is still valid with backend
                    try {
                        await getUserProfile();
                    } catch (error) {
                        // Silently handle the error during initialization
                        console.error('Error validating token during init', error);
                    }
                } catch (error) {
                    console.error('Error parsing user data from localStorage', error);
                    localStorage.removeItem('userData');
                }
            }

            // Important: mark initialization as complete even if there was an error
            setIsInitialized(true);
        };

        initAuth();
    }, []);

    const getUserProfile = async () => {
        if (!user?.token) return;

        try {
            console.log('Fetching current user profile');
            const response = await authAPI.getCurrentUser();
            if (response.data && user) {
                console.log('User profile retrieved successfully', response.data);
                // Update user data with fresh profile info
                setUser({
                    ...user,
                    name: response.data.name,
                    email: response.data.email,
                });
            }
        } catch (error) {
            console.error('Error fetching user profile', error);
            // If token is invalid, force logout
            if ((error as any)?.response?.status === 401) {
                console.log('Token invalid, logging out');
                logout();
            }
            // Re-throw the error so the caller can handle it if needed
            throw error;
        }
    };

    const login = async (email: string, password: string) => {
        try {
            console.log('Attempting login with:', { email, password: '********' });
            const response = await authAPI.login(email, password);
            console.log('Login response:', response.data);

            const { user: userData, token } = response.data;

            if (!userData || !token) {
                console.error('Login response missing user data or token');
                toast.error('Login failed', {
                    description: 'Invalid response from server'
                });
                return false;
            }

            // Store user data with token
            const userDataToStore = {
                isLoggedIn: true,
                type: userData.type,
                role: userData.role,
                token: token,
                name: userData.name,
                email: userData.email
            };

            localStorage.setItem('userData', JSON.stringify(userDataToStore));
            setUser(userDataToStore);
            setIsAuthenticated(true);

            toast.success('Login successful', {
                description: `Welcome back, ${userData.name || 'user'}!`
            });

            return true;
        } catch (error: any) {
            console.error('Login error:', error);
            toast.error('Login failed', {
                description: error.userMessage || 'Please check your credentials and try again.'
            });
            return false;
        }
    };

    const register = async (userData: any) => {
        try {
            console.log('Attempting registration with:', { ...userData, password: '********' });
            const response = await authAPI.register(userData);
            console.log('Registration response:', response.data);

            const { user: registeredUser, token } = response.data;

            if (!registeredUser || !token) {
                console.error('Registration response missing user data or token');
                toast.error('Registration failed', {
                    description: 'Invalid response from server'
                });
                return false;
            }

            // Store user data with token
            const userDataToStore = {
                isLoggedIn: true,
                type: registeredUser.type,
                role: registeredUser.role,
                token: token,
                name: registeredUser.name,
                email: registeredUser.email
            };

            localStorage.setItem('userData', JSON.stringify(userDataToStore));
            setUser(userDataToStore);
            setIsAuthenticated(true);

            toast.success('Registration successful', {
                description: `Welcome to CarConnect, ${registeredUser.name || 'user'}!`
            });

            return true;
        } catch (error: any) {
            console.error('Registration error:', error);
            toast.error('Registration failed', {
                description: error.userMessage || 'Please check your information and try again.'
            });
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('userData');
        setUser(null);
        setIsAuthenticated(false);
        toast.success('You have been logged out');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                isAuthenticated,
                isInitialized,
                getUserProfile
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};