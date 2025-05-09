
import React, { useState } from 'react';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AadhaarVerificationProps {
  onVerified: (verified: boolean) => void;
}

const AadhaarVerification = ({ onVerified }: AadhaarVerificationProps) => {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  
  const validateAadhaar = (value: string) => {
    // Basic validation: 12 digits
    return /^\d{12}$/.test(value);
  };
  
  const handleSendOtp = () => {
    if (!validateAadhaar(aadhaarNumber)) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    
    setError('');
    // In a real app, this would call an API to send OTP
    setStep(2);
  };
  
  const handleVerifyOtp = () => {
    if (!otp || otp.length < 6) {
      setError('Please enter a valid OTP');
      return;
    }
    
    // In a real app, this would verify the OTP via API
    // For demo, we're just simulating success
    setError('');
    setIsVerified(true);
    onVerified(true);
    setStep(3);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="p-6 border-b border-gray-200 bg-slate-50">
        <h3 className="text-xl font-bold text-slate-800 flex items-center">
          <Shield className="mr-2 text-primary" size={22} />
          Aadhaar Verification
        </h3>
        <p className="text-gray-600 mt-1 text-sm">
          For enhanced security and trust, we verify all users with Aadhaar.
        </p>
      </div>
      
      <div className="p-6">
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700">
                Enter your 12-digit Aadhaar Number
              </label>
              <Input
                id="aadhaar"
                type="text"
                placeholder="XXXX XXXX XXXX"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                className="border-gray-300"
                maxLength={12}
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>
            <Button onClick={handleSendOtp} className="w-full">
              Send OTP
            </Button>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Enter the OTP sent to your registered mobile
              </label>
              <Input
                id="otp"
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="border-gray-300"
                maxLength={6}
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>
            <div className="flex space-x-3">
              <Button onClick={handleVerifyOtp} className="flex-1">
                Verify OTP
              </Button>
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="text-center py-3">
            <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-slate-800">Verification Successful</h3>
            <p className="text-gray-600 mt-1">
              Your Aadhaar has been successfully verified.
            </p>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-start space-x-2">
          <AlertCircle size={18} className="text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600">
            Your Aadhaar information is secure and encrypted. We only use it for verification 
            purposes and never share it with third parties.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AadhaarVerification;
