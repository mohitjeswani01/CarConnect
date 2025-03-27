import React, { useState } from "react";
import { AlertCircle, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SOSButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSOSClick = () => {
        setIsModalOpen(true);
    };

    const handleEmergencyCall = () => {
        toast.success("Emergency call initiated", {
            description: "Help is on the way. Stay calm and safe.",
        });
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="fixed bottom-8 right-8 z-40">
                <Button
                    variant="destructive"
                    size="lg"
                    className="rounded-full h-16 w-16 shadow-lg hover:scale-105 transition-transform font-bold text-lg"
                    onClick={handleSOSClick}
                >
                    SOS
                </Button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="animate-scale-in bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center text-red-600 dark:text-red-500">
                                <AlertCircle size={24} className="mr-2" />
                                <h3 className="text-xl font-bold">Emergency Assistance</h3>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="py-4">
                            <p className="text-lg mb-6">
                                Are you in an emergency situation?
                                Our support team will be notified immediately.
                            </p>

                            <div className="space-y-4">
                                <Button
                                    variant="destructive"
                                    className="w-full h-12 text-base font-semibold flex items-center justify-center"
                                    onClick={handleEmergencyCall}
                                >
                                    <Phone className="mr-2" />
                                    Call Emergency Support
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                            </div>

                            <p className="mt-6 text-sm text-muted-foreground">
                                If you are in immediate danger, please call your local emergency number directly.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SOSButton;