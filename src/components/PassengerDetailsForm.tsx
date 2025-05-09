
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ride } from '@/data/rides';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, Users } from 'lucide-react';

export interface PassengerDetail {
  name: string;
  age: number;
  gender: string;
}

interface PassengerDetailsFormProps {
  ride: Ride;
  onComplete: (details: PassengerDetail[], seats: number) => void;
  onCancel: () => void;
}

const PassengerDetailsForm: React.FC<PassengerDetailsFormProps> = ({ ride, onComplete, onCancel }) => {
  const [seats, setSeats] = useState(1);
  const [passengerNames, setPassengerNames] = useState<string[]>(['']);
  const [passengerAges, setPassengerAges] = useState<string[]>(['']);
  const [passengerGenders, setPassengerGenders] = useState<string[]>(['male']);
  const [errors, setErrors] = useState<string[]>([]);

  // Update passenger arrays when seat count changes
  const handleSeatsChange = (value: string) => {
    const newSeats = parseInt(value);
    setSeats(newSeats);
    
    // Resize passenger arrays
    setPassengerNames(prev => {
      const newArray = [...prev];
      if (newSeats > prev.length) {
        for (let i = prev.length; i < newSeats; i++) {
          newArray.push('');
        }
      } else if (newSeats < prev.length) {
        return newArray.slice(0, newSeats);
      }
      return newArray;
    });
    
    setPassengerAges(prev => {
      const newArray = [...prev];
      if (newSeats > prev.length) {
        for (let i = prev.length; i < newSeats; i++) {
          newArray.push('');
        }
      } else if (newSeats < prev.length) {
        return newArray.slice(0, newSeats);
      }
      return newArray;
    });
    
    setPassengerGenders(prev => {
      const newArray = [...prev];
      if (newSeats > prev.length) {
        for (let i = prev.length; i < newSeats; i++) {
          newArray.push('male');
        }
      } else if (newSeats < prev.length) {
        return newArray.slice(0, newSeats);
      }
      return newArray;
    });
    
    // Reset errors
    setErrors([]);
  };

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...passengerNames];
    newNames[index] = value;
    setPassengerNames(newNames);
  };

  const handleAgeChange = (index: number, value: string) => {
    const newAges = [...passengerAges];
    newAges[index] = value;
    setPassengerAges(newAges);
  };

  const handleGenderChange = (index: number, value: string) => {
    const newGenders = [...passengerGenders];
    newGenders[index] = value;
    setPassengerGenders(newGenders);
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    
    for (let i = 0; i < seats; i++) {
      if (!passengerNames[i]) {
        newErrors[i] = 'Please enter passenger name';
      } else if (!passengerAges[i] || isNaN(parseInt(passengerAges[i]))) {
        newErrors[i] = 'Please enter a valid age';
      } else if (parseInt(passengerAges[i]) < 1 || parseInt(passengerAges[i]) > 120) {
        newErrors[i] = 'Please enter a valid age between 1 and 120';
      }
    }
    
    setErrors(newErrors);
    return newErrors.filter(Boolean).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Create passenger details array
    const details: PassengerDetail[] = [];
    for (let i = 0; i < seats; i++) {
      details.push({
        name: passengerNames[i],
        age: parseInt(passengerAges[i]),
        gender: passengerGenders[i]
      });
    }
    
    // Call onComplete with passenger details and seats
    onComplete(details, seats);
  };

  return (
    <div>
      <CardHeader className="bg-primary/5 border-b border-primary/10">
        <CardTitle className="text-xl text-slate-800">Passenger Details</CardTitle>
        <CardDescription>
          Enter details for all passengers traveling from {ride.from} to {ride.to}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <form id="passenger-form" onSubmit={handleSubmit}>
          <div className="mb-6">
            <Label htmlFor="seats" className="block mb-2">Number of Seats</Label>
            <div className="flex items-center">
              <Select 
                value={seats.toString()} 
                onValueChange={handleSeatsChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select seats" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(ride.seatsAvailable)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1} {i === 0 ? 'seat' : 'seats'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="ml-4 text-sm text-muted-foreground">
                <Users className="inline h-4 w-4 mr-1" />
                {ride.seatsAvailable} available
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {[...Array(seats)].map((_, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium mb-3">Passenger {index + 1}</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`name-${index}`} className="block mb-1">Full Name</Label>
                    <Input
                      id={`name-${index}`}
                      value={passengerNames[index]}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      placeholder="Enter passenger name"
                      className={errors[index] && !passengerNames[index] ? 'border-red-500' : ''}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`age-${index}`} className="block mb-1">Age</Label>
                      <Input
                        id={`age-${index}`}
                        type="number"
                        min="1"
                        max="120"
                        value={passengerAges[index]}
                        onChange={(e) => handleAgeChange(index, e.target.value)}
                        placeholder="Age"
                        className={errors[index] && (!passengerAges[index] || isNaN(parseInt(passengerAges[index]))) ? 'border-red-500' : ''}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`gender-${index}`} className="block mb-1">Gender
                        <Select 
                          value={passengerGenders[index]} 
                          onValueChange={(value) => handleGenderChange(index, value)}
                        >
                          <SelectTrigger className="!w-full">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            {errors.map((error, index) => (
              error && <p key={index} className="text-red-500 mb-2">{error}</p>
            ))}
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={onCancel}>
              Back
            </Button>
            <Button type="submit" className="!w-full">
              Continue to Payment
            </Button>
          </div>
        </form>
      </CardContent>
    </div>
  );
};

export default PassengerDetailsForm;




