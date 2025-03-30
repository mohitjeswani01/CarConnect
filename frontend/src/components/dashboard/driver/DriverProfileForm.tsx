import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { driverAPI } from "@/services/api";
import { toast } from "sonner";

interface DriverProfileFormProps {
  onComplete: () => void;
}

const DriverProfileForm = ({ onComplete }: DriverProfileFormProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      const licenseNumber = formData.get("licenseNumber") as string;
      const licenseExpiry = formData.get("licenseExpiry") as string;
      const location = formData.get("location") as string;
      const phoneNumber = formData.get("phoneNumber") as string;
      const experience = formData.get("experience") as string;
      const bio = formData.get("bio") as string;

      if (!licenseNumber || !licenseExpiry || !location || !phoneNumber) {
        toast.error("Please fill all required fields");
        return;
      }

      const profileData = {
        licenseNumber,
        licenseExpiry,
        location,
        phoneNumber,
        experience: parseInt(experience) || 0,
        bio,
        languages: ["English", "Hindi"],
        vehiclePreferences: ["Sedan", "SUV"],
      };

      const response = await driverAPI.createUpdateProfile(profileData);
      console.log("Profile created:", response.data);

      toast.success("Driver profile created successfully");
      onComplete();
    } catch (error) {
      console.error("Error creating driver profile:", error);
      toast.error("Failed to create driver profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow"
    >
      <div className="text-2xl font-bold mb-6">
        Complete Your Driver Profile
      </div>
      <p className="text-muted-foreground mb-6">
        Please provide your driver details to complete registration.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="licenseNumber">License Number*</Label>
          <Input
            id="licenseNumber"
            name="licenseNumber"
            placeholder="Enter your driving license number"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="licenseExpiry">License Expiry Date*</Label>
          <Input id="licenseExpiry" name="licenseExpiry" type="date" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Service Location*</Label>
          <Input
            id="location"
            name="location"
            placeholder="e.g. Mumbai, Delhi"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number*</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            placeholder="e.g. +91 98765 43210"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Years of Experience</Label>
          <Input
            id="experience"
            name="experience"
            type="number"
            min="0"
            max="50"
            placeholder="e.g. 5"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio / About You</Label>
        <Textarea
          id="bio"
          name="bio"
          placeholder="Tell us about yourself and your driving experience..."
          rows={4}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Complete Registration"}
      </Button>
    </form>
  );
};

export default DriverProfileForm;
