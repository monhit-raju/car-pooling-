
import React from 'react';
import { Ride } from '@/data/rides';
import PaymentPage from './payment/PaymentPage';
import { PassengerDetail } from './PassengerDetailsForm';
import { Calendar } from './ui/calendar';

interface PaymentProcessWrapperProps {
  ride: Ride;
  passengerCount: number;
  onPaymentComplete: () => void;
}

// This wrapper component helps bridge the payment components
const PaymentProcessWrapper = ({ ride, passengerCount, onPaymentComplete }: PaymentProcessWrapperProps) => {
  // Calculate the total fare based on passenger count
  const baseFare = parseInt(ride.price.replace(/,/g, ''));
  const totalFare = baseFare * passengerCount;
  
  // Create a modified ride object with updated price
  const rideWithUpdatedPrice = {
    ...ride,
    price: totalFare.toLocaleString('en-IN')
  };
  
  // Create mock passenger details based on count
  const mockPassengerDetails: PassengerDetail[] = Array(passengerCount).fill(null).map((_, index) => ({
    name: `Passenger ${index + 1}`,
    age: 30, // Adding required age property
    gender: 'male' // Adding required gender property
  }));
  
  return (
    <div className="bg-white rounded-lg shadow-lg">
      <PaymentPage 
        ride={rideWithUpdatedPrice}
        passengerDetails={mockPassengerDetails}
        onPaymentComplete={onPaymentComplete}
        onCancel={() => {}} // No-op since this wrapper doesn't need a cancel option
      />
    </div>
  );
};

export default PaymentProcessWrapper;

