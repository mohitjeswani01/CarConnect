import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

interface BookingFormProps {
    carId: string;
    pricePerDay: number;
    withDriver: boolean; // Add this property
    onSubmit: (bookingData: {
      carId: string;
      numberOfDays: number;
      totalAmount: number;
      withDriver: boolean;
    }) => Promise<void>;
  }

const BookingForm = ({ carId, pricePerDay, onSubmit }: BookingFormProps) => {
  const [days, setDays] = useState<number>(1);
  const [withDriver, setWithDriver] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(pricePerDay);

  useEffect(() => {
    // Calculate total price
    const driverCost = withDriver ? 500 : 0; // Additional driver cost per day
    const newTotal = (pricePerDay + driverCost) * days;
    setTotalPrice(newTotal);
  }, [days, withDriver, pricePerDay]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (days < 1) {
      toast.error("Please enter at least 1 day");
      return;
    }

    try {
      await onSubmit({
        carId,
        numberOfDays: days,
        withDriver,
        totalAmount: totalPrice,
      });
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error('Failed to create booking');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div>
        <Label htmlFor="days">Number of Days</Label>
        <Input
          id="days"
          type="number"
          min="1"
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value) || 1)}
          className="mt-1"
        />
      </div>

      <div>
        <Label>Driver Option</Label>
        <RadioGroup
          defaultValue="without"
          onValueChange={(value) => setWithDriver(value === 'with')}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="without" id="without" />
            <Label htmlFor="without">Without Driver</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="with" id="with" />
            <Label htmlFor="with">With Driver (+₹500/day)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span>Base Price per Day:</span>
          <span>₹{pricePerDay}</span>
        </div>
        {withDriver && (
          <div className="flex justify-between items-center mb-4">
            <span>Driver Cost per Day:</span>
            <span>₹500</span>
          </div>
        )}
        <div className="flex justify-between items-center font-bold">
          <span>Total Amount:</span>
          <span>₹{totalPrice}</span>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Confirm Booking
      </Button>
    </form>
  );
};

export default BookingForm;