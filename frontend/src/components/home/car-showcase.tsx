import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, Car, Users, Gauge, Fuel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const cars = [
    {
        id: 1,
        name: "Tesla Model 3",
        category: "Electric",
        price: 75,
        image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80",
        features: {
            seats: 5,
            transmission: "Automatic",
            power: "Electric",
            range: "358 miles",
        },
    },
    {
        id: 2,
        name: "Mercedes-Benz E-Class",
        category: "Sedan",
        price: 110,
        image: "images/mercedes.png",
        features: {
            seats: 5,
            transmission: "Automatic",
            power: "Gasoline",
            range: "540 miles",
        },
    },
    {
        id: 3,
        name: "BMW X5",
        category: "SUV",
        price: 135,
        image: "images/bmw.png",
        features: {
            seats: 7,
            transmission: "Automatic",
            power: "Gasoline",
            range: "450 miles",
        },
    },
];

const CarShowcase = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextCar = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % cars.length);
    };

    const prevCar = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + cars.length) % cars.length);
    };

    const currentCar = cars[currentIndex];

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
                        Featured Vehicles
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
                        Explore Our Premium Fleet
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Discover our collection of meticulously maintained vehicles that cater to your every need, from luxury sedans to spacious SUVs.
                    </p>
                </motion.div>

                <div className="relative">
                    <div className="rounded-2xl overflow-hidden shadow-xl bg-white dark:bg-gray-800">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="relative h-64 lg:h-auto">
                                <motion.img
                                    key={currentCar.id}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    src={currentCar.image}
                                    alt={currentCar.name}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                                    <div className="p-6">
                                        <Badge variant="secondary" className="mb-2">
                                            {currentCar.category}
                                        </Badge>
                                        <h3 className="text-2xl font-bold text-white">{currentCar.name}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h4 className="text-xl font-semibold">{currentCar.name}</h4>
                                        <div className="flex items-baseline">
                                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                ${currentCar.price}
                                            </span>
                                            <span className="text-muted-foreground ml-1">/day</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="flex items-center space-x-2">
                                            <Users size={20} className="text-muted-foreground" />
                                            <span>{currentCar.features.seats} Seats</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Car size={20} className="text-muted-foreground" />
                                            <span>{currentCar.features.transmission}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Fuel size={20} className="text-muted-foreground" />
                                            <span>{currentCar.features.power}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Gauge size={20} className="text-muted-foreground" />
                                            <span>{currentCar.features.range}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <Button className="flex-1 rounded-lg text-base h-11 transition-all hover:shadow-md">
                                        Rent Now
                                    </Button>
                                    <Button variant="outline" className="flex-1 rounded-lg text-base h-11">
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-3">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-10 w-10 rounded-full shadow-md"
                            onClick={prevCar}
                        >
                            <ChevronLeft size={20} />
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-10 w-10 rounded-full shadow-md"
                            onClick={nextCar}
                        >
                            <ChevronRight size={20} />
                        </Button>
                    </div>
                </div>

                <div className="flex justify-center mt-12">
                    <div className="flex space-x-2">
                        {cars.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? "bg-blue-600 w-6"
                                    : "bg-gray-300 dark:bg-gray-700"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CarShowcase;