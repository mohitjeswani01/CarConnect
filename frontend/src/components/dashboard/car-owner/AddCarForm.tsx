import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface AddCarFormProps {
  onSubmit: (e: React.FormEvent) => void;
}

const AddCarForm: React.FC<AddCarFormProps> = ({ onSubmit }) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFeatureChange = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create a preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    const form = e.target as HTMLFormElement;
    const make = form.make.value;
    const model = form.model.value;
    const year = form.year.value;
    const price = form.pricePerDay.value;

    if (!make || !model || !year || !price) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!selectedFile) {
      toast.error("Please upload at least one photo of your car");
      return;
    }

    // Create the FormData object from the form
    const formData = new FormData(form);

    // Add features as separate items for backend processing
    if (selectedFeatures.length > 0) {
      formData.delete("features"); // Remove any existing features field
      selectedFeatures.forEach((feature) => {
        formData.append("features", feature);
      });
    }

    // Call the onSubmit prop with the event
    onSubmit(e);

    // Clean up preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow"
    >
      <div className="text-xl font-semibold mb-4">Add New Car</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Make */}
        <div className="space-y-2">
          <Label htmlFor="make">Make *</Label>
          <Input id="make" name="make" placeholder="e.g. Toyota" required />
        </div>

        {/* Model */}
        <div className="space-y-2">
          <Label htmlFor="model">Model *</Label>
          <Input id="model" name="model" placeholder="e.g. Innova" required />
        </div>

        {/* Year */}
        <div className="space-y-2">
          <Label htmlFor="year">Year *</Label>
          <Input
            id="year"
            name="year"
            type="number"
            placeholder="e.g. 2020"
            min="1990"
            max={new Date().getFullYear()}
            required
          />
        </div>

        {/* Color */}
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input id="color" name="color" placeholder="e.g. White" />
        </div>

        {/* License Plate */}
        <div className="space-y-2">
          <Label htmlFor="licensePlate">License Plate</Label>
          <Input
            id="licensePlate"
            name="licensePlate"
            placeholder="e.g. DL 01 AB 1234"
          />
        </div>

        {/* Price Per Day */}
        <div className="space-y-2">
          <Label htmlFor="pricePerDay">Price Per Day (₹) *</Label>
          <Input
            id="pricePerDay"
            name="pricePerDay"
            type="number"
            placeholder="e.g. 1500"
            min="100"
            required
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" placeholder="e.g. Delhi" />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            className="w-full h-10 rounded-md border border-input px-3 py-2 bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="Hatchback">Hatchback</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="MPV">MPV</option>
            <option value="Luxury">Luxury</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe your car..."
          rows={4}
        />
      </div>

      {/* Features */}
      <div className="space-y-2">
        <Label>Features</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="automatic"
              checked={selectedFeatures.includes("Automatic")}
              onCheckedChange={() => handleFeatureChange("Automatic")}
            />
            <label htmlFor="automatic">Automatic</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="manual"
              checked={selectedFeatures.includes("Manual")}
              onCheckedChange={() => handleFeatureChange("Manual")}
            />
            <label htmlFor="manual">Manual</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="petrol"
              checked={selectedFeatures.includes("Petrol")}
              onCheckedChange={() => handleFeatureChange("Petrol")}
            />
            <label htmlFor="petrol">Petrol</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="diesel"
              checked={selectedFeatures.includes("Diesel")}
              onCheckedChange={() => handleFeatureChange("Diesel")}
            />
            <label htmlFor="diesel">Diesel</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ac"
              checked={selectedFeatures.includes("AC")}
              onCheckedChange={() => handleFeatureChange("AC")}
            />
            <label htmlFor="ac">AC</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="seats5"
              checked={selectedFeatures.includes("5 seats")}
              onCheckedChange={() => handleFeatureChange("5 seats")}
            />
            <label htmlFor="seats5">5 Seats</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="seats7"
              checked={selectedFeatures.includes("7 seats")}
              onCheckedChange={() => handleFeatureChange("7 seats")}
            />
            <label htmlFor="seats7">7 Seats</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="mileage"
              checked={selectedFeatures.includes("15 km/l mileage")}
              onCheckedChange={() => handleFeatureChange("15 km/l mileage")}
            />
            <label htmlFor="mileage">15 km/l Mileage</label>
          </div>
        </div>
      </div>

      {/* Photo Upload */}
      <div className="space-y-2">
        <Label htmlFor="photos">Car Photos *</Label>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 rounded-md">
          <Input
            id="photos"
            name="photos"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-2"
            required
          />
          {previewUrl && (
            <div className="relative w-full h-40 mt-2">
              <img
                src={previewUrl}
                alt="Car preview"
                className="w-full h-full object-contain rounded-md"
              />
            </div>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            Upload at least one photo of your car. Max size: 5MB.
          </p>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Add Car
      </Button>
    </form>
  );
};

export default AddCarForm;
