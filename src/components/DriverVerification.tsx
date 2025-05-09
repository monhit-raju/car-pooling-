
import React, { useState } from 'react';
import { Car, CheckCircle, AlertCircle, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface DriverVerificationProps {
  onVerified: (verified: boolean) => void;
}

const DriverVerification = ({ onVerified }: DriverVerificationProps) => {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carRegistration, setCarRegistration] = useState('');
  const [carDescription, setCarDescription] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const { toast } = useToast();
  
  const validateLicense = (value: string) => {
    // Basic validation for license number - this would be more complex in real implementation
    return value.length >= 8;
  };
  
  const validateCarInfo = () => {
    return carModel.length > 0 && carRegistration.length >= 5;
  };
  
  const handleVerifyLicense = () => {
    if (!validateLicense(licenseNumber)) {
      setError('Please enter a valid license number');
      return;
    }
    
    setError('');
    // In a real app, this would verify with the transport department API
    toast({
      title: "License Verification Initiated",
      description: "We're verifying your license. This may take a moment.",
    });
    
    // Simulate API call
    setTimeout(() => {
      setStep(2);
      toast({
        title: "License Verified",
        description: "Your driving license has been successfully verified.",
      });
    }, 2000);
  };
  
  const handleVerifyCarDetails = () => {
    if (!validateCarInfo()) {
      setError('Please enter valid car details');
      return;
    }
    
    setError('');
    // In a real app, this would verify with the vehicle registry
    toast({
      title: "Vehicle Verification Initiated",
      description: "We're verifying your vehicle details. This may take a moment.",
    });
    
    // Simulate API call
    setTimeout(() => {
      setStep(3);
      onVerified(true);
      toast({
        title: "Vehicle Verified",
        description: "Your vehicle details have been successfully verified.",
      });
    }, 2000);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="p-6 border-b border-gray-200 bg-slate-50">
        <h3 className="text-xl font-bold text-slate-800 flex items-center">
          <Car className="mr-2 text-primary" size={22} />
          Driver & Vehicle Verification
        </h3>
        <p className="text-gray-600 mt-1 text-sm">
          For safety and compliance, we verify all drivers and their vehicles.
        </p>
      </div>
      
      <div className="p-6">
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="license" className="block text-sm font-medium text-gray-700">
                Enter your Driving License Number
              </label>
              <Input
                id="license"
                type="text"
                placeholder="e.g. DL-0420110012345"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="border-gray-300"
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">
                We'll verify your license with the transport department database. This helps us ensure that all drivers on our platform have valid driving licenses.
              </p>
            </div>
            <Button onClick={handleVerifyLicense} className="w-full">
              Verify License
            </Button>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="carModel" className="block text-sm font-medium text-gray-700">
                Car Model
              </label>
              <Input
                id="carModel"
                type="text"
                placeholder="e.g. Toyota Innova"
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
                className="border-gray-300"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="registration" className="block text-sm font-medium text-gray-700">
                Registration Number
              </label>
              <Input
                id="registration"
                type="text"
                placeholder="e.g. KA-01-AB-1234"
                value={carRegistration}
                onChange={(e) => setCarRegistration(e.target.value.toUpperCase())}
                className="border-gray-300"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Car Description (color, features, etc.)
              </label>
              <Textarea
                id="description"
                placeholder="e.g. White Toyota Innova with AC, 7-seater"
                value={carDescription}
                onChange={(e) => setCarDescription(e.target.value)}
                className="border-gray-300"
              />
            </div>
            
            {error && <p className="text-destructive text-sm">{error}</p>}
            
            <div className="flex space-x-3">
              <Button onClick={handleVerifyCarDetails} className="flex-1">
                Verify Car Details
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
              Your driving license and vehicle have been successfully verified.
            </p>
            <div className="mt-4 bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-center">
                <FileCheck className="text-green-500 mr-2" />
                <p className="text-green-800 font-medium">You're ready to offer rides!</p>
              </div>
              <p className="text-green-700 text-sm mt-1">
                You can now start offering rides to passengers on our platform.
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-start space-x-2">
          <AlertCircle size={18} className="text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600">
            Your license and vehicle information is secure and encrypted. We only use it for verification 
            purposes and periodic safety checks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DriverVerification;
