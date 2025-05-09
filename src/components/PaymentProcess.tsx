
import React, { useState } from 'react';
import { CreditCard, CheckCircle, AlertCircle, Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Ride } from '@/data/rides';

interface PaymentProcessProps {
  ride: Ride;
  onPaymentComplete: () => void;
}

const PaymentProcess = ({ ride, onPaymentComplete }: PaymentProcessProps) => {
  const [step, setStep] = useState(1);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };
  
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setExpiryDate(formattedValue);
  };
  
  const validateCardDetails = () => {
    // Basic validation
    if (cardNumber.replace(/\s/g, '').length < 16) {
      toast({
        title: "Invalid Card Number",
        description: "Please enter a valid 16-digit card number",
        variant: "destructive"
      });
      return false;
    }
    
    if (expiryDate.length < 5) {
      toast({
        title: "Invalid Expiry Date",
        description: "Please enter a valid expiry date in MM/YY format",
        variant: "destructive"
      });
      return false;
    }
    
    if (cvv.length < 3) {
      toast({
        title: "Invalid CVV",
        description: "Please enter a valid 3-digit CVV code",
        variant: "destructive"
      });
      return false;
    }
    
    if (nameOnCard.length < 3) {
      toast({
        title: "Invalid Name",
        description: "Please enter the name as it appears on your card",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };
  
  const handlePayment = () => {
    if (!validateCardDetails()) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    toast({
      title: "Processing Payment",
      description: "Please wait while we process your payment...",
    });
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
      toast({
        title: "Payment Successful",
        description: `Your ride from ${ride.from} to ${ride.to} has been booked!`,
      });
    }, 2000);
  };
  
  const handleComplete = () => {
    onPaymentComplete();
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="p-6 border-b border-gray-200 bg-slate-50">
        <h3 className="text-xl font-bold text-slate-800 flex items-center">
          <CreditCard className="mr-2 text-primary" size={22} />
          Secure Payment
        </h3>
        <p className="text-gray-600 mt-1 text-sm">
          Pay securely for your ride from {ride.from} to {ride.to}
        </p>
      </div>
      
      <div className="p-6">
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
              <div className="flex items-center mb-2">
                <Shield className="mr-2 text-blue-600" size={20} />
                <h4 className="font-semibold text-blue-800">Ride Summary</h4>
              </div>
              <ul className="space-y-1 text-sm text-blue-700">
                <li className="flex justify-between">
                  <span>From:</span>
                  <span className="font-medium">{ride.from} ({ride.fromDetail})</span>
                </li>
                <li className="flex justify-between">
                  <span>To:</span>
                  <span className="font-medium">{ride.to} ({ride.toDetail})</span>
                </li>
                <li className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{ride.date}</span>
                </li>
                <li className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-medium">{ride.departureTime}</span>
                </li>
                <li className="flex justify-between">
                  <span>Driver:</span>
                  <span className="font-medium">{ride.driverName}</span>
                </li>
                <li className="flex justify-between font-medium text-lg text-blue-800 pt-2 border-t border-blue-200 mt-2">
                  <span>Amount:</span>
                  <span>₹{ride.price}</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                  Card Number
                </label>
                <div className="mt-1 relative">
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                    className="pl-10"
                  />
                  <CreditCard className="absolute left-3 top-3 text-gray-400" size={16} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                    Expiry Date
                  </label>
                  <Input
                    id="expiryDate"
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    maxLength={5}
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                    CVV
                  </label>
                  <Input
                    id="cvv"
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    maxLength={3}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700">
                  Name on Card
                </label>
                <Input
                  id="nameOnCard"
                  type="text"
                  placeholder="John Smith"
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              onClick={handlePayment} 
              className="w-full" 
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : `Pay ₹${ride.price}`}
            </Button>
            
            <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
              <Lock size={14} className="mr-1 text-gray-400" />
              Your payment information is securely encrypted
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="text-center py-4">
            <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-1">Payment Successful!</h3>
            <p className="text-gray-600 mb-6">
              Your ride has been booked successfully.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium text-gray-800 mb-2">Ride Details</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span className="font-medium">{ride.from}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium">{ride.to}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-medium">{ride.date}, {ride.departureTime}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Driver:</span>
                  <span className="font-medium">{ride.driverName}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium">{ride.carModel}</span>
                </li>
                <li className="flex justify-between font-medium text-primary pt-2 border-t border-gray-200 mt-2">
                  <span>Booking ID:</span>
                  <span>EC{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span>
                </li>
              </ul>
            </div>
            
            <Button onClick={handleComplete} className="w-full">
              View Booking
            </Button>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-start space-x-2">
          <AlertCircle size={18} className="text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600">
            Your payment is protected by our secure payment system. In case of any issues, 
            our 24/7 customer support team is available to assist you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcess;
