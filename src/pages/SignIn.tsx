import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, User, ArrowRight, Car, Users, Shield } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import AadhaarVerification from '@/components/AadhaarVerification';
import DriverVerification from '@/components/DriverVerification';
import ApiService from '@/lib/api';
import { determineRedirectPath } from '@/lib/auth';

interface SignInProps {
  initialMode?: 'signin' | 'register';
}

const SignIn: React.FC<SignInProps> = ({ initialMode = 'signin' }) => {
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userRole, setUserRole] = useState('passenger');
  const [registrationStep, setRegistrationStep] = useState(1);
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
  const [isDriverVerified, setIsDriverVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  // Mock user database for demonstration
  const mockUsers = [
    { id: 'user-1', email: 'john@example.com', password: 'password123', name: 'John Smith', role: 'passenger' },
    { id: 'user-2', email: 'mary@example.com', password: 'password123', name: 'Mary Johnson', role: 'driver' },
    { id: 'user-3', email: 'demo@example.com', password: 'demo', name: 'Demo User', role: 'passenger' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isRegister) {
        // Continue with basic info check
        if (!name || !email || !password) {
          toast({
            title: "Missing information",
            description: "Please fill in all fields",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        
        // Move to verification step
        setRegistrationStep(2);
        setIsLoading(false);
      } else {
        // Login flow
        if (!email || !password) {
          toast({
            title: "Missing information",
            description: "Please enter your email and password",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        
        try {
          // Try to use the API service first
          const response = await ApiService.login({ email, password });
          
          toast({
            title: "Welcome back!",
            description: `Signed in successfully as ${response.user.role}`,
          });
          
          // Get the appropriate redirect path based on user role
          const redirectPath = determineRedirectPath(response.user.role);
          console.log("Redirecting to:", redirectPath); // Add this for debugging
          
          // Navigate to the role-specific dashboard
          navigate(redirectPath, { replace: true });
        } catch (error) {
          console.error('API login failed, falling back to mock data:', error);
          
          // Fallback to mock data if API fails
          const storedUsers = JSON.parse(localStorage.getItem('elitecars_users') || '[]');
          const allUsers = [...mockUsers, ...storedUsers];
          
          // Find user
          const user = allUsers.find(user => user.email === email && user.password === password);
          
          if (!user) {
            toast({
              title: "Authentication failed",
              description: "Invalid email or password",
              variant: "destructive"
            });
            setIsLoading(false);
            return;
          }
          
          toast({
            title: "Welcome back!",
            description: `Signed in successfully as ${user.role}`,
          });
          
          // Store current user
          localStorage.setItem('elitecars_token', 'mock-token-for-demo');
          localStorage.setItem('elitecars_current_user', JSON.stringify({ 
            email: user.email, 
            name: user.name, 
            role: user.role,
            id: user.id || `user-${Date.now()}` // Generate a temporary ID if none exists
          }));
          
          // Get the appropriate redirect path based on user role
          const redirectPath = determineRedirectPath(user.role);
          console.log("Redirecting to (fallback):", redirectPath); // Add this for debugging
          
          // Navigate to the role-specific dashboard with replace:true
          navigate(redirectPath, { replace: true });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteVerification = async () => {
    setIsLoading(true);
    
    try {
      // Check if user already exists
      const userExists = mockUsers.some(user => user.email === email);
      if (userExists) {
        toast({
          title: "Account already exists",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive"
        });
        setIsRegister(false);
        setRegistrationStep(1);
        setIsLoading(false);
        return;
      }
      
      try {
        // Try to use the API service first
        const response = await ApiService.register({ 
          name, 
          email, 
          password, 
          role: userRole as 'passenger' | 'driver' 
        });
        
        toast({
          title: "Account created!",
          description: `Welcome to EliteCars. You are registered as a ${userRole}.`,
        });
        
        // Navigate to dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('API registration failed, falling back to localStorage:', error);
        
        // Fallback to localStorage if API fails
        toast({
          title: "Account created!",
          description: `Welcome to EliteCars. You are registered as a ${userRole}.`,
        });
        
        // Store user info in localStorage to simulate database
        const users = JSON.parse(localStorage.getItem('elitecars_users') || '[]');
        users.push({ email, password, name, role: userRole });
        localStorage.setItem('elitecars_users', JSON.stringify(users));
        
        // Store current user and token
        localStorage.setItem('elitecars_token', 'mock-token-for-demo');
        localStorage.setItem('elitecars_current_user', JSON.stringify({ 
          email, name, role: userRole 
        }));
        
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side: Image and branding */}
        <div className="hidden md:block relative h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 rounded-xl z-10"></div>
          <div 
            className="h-[600px] w-full rounded-xl bg-cover bg-center relative overflow-hidden"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')" }}
          >
          </div>
          <div className="absolute top-10 left-10 z-20">
            <h1 className="text-3xl font-bold text-white mb-4">
              Elite<span className="text-accent">Cars</span>
            </h1>
            <p className="text-white/90 max-w-md">
              Join thousands of travelers finding the perfect ride for their journey.
            </p>
          </div>
          <div className="absolute bottom-10 left-10 right-10 z-20">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20">
              <p className="text-white font-medium">"EliteCars made my travel experience seamless. Found the perfect ride at the right price!"</p>
              <div className="flex items-center mt-3">
                <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-white font-bold">TE</span>
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium">TEAM ELITE TN</p>
                  <p className="text-white/70 text-sm">TN, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side: Sign in/Register form */}
        <div>
          {isRegister && registrationStep === 2 ? (
            <Card className="shadow-lg border-none">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Shield className="mr-2 text-primary" size={22} />
                  Verify Your Identity
                </CardTitle>
                <CardDescription>
                  We need to verify your identity to ensure safety for all users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userRole === 'passenger' ? (
                  /* Passenger verification */
                  <div className="space-y-6">
                    {!isAadhaarVerified ? (
                      <AadhaarVerification onVerified={(verified) => setIsAadhaarVerified(verified)} />
                    ) : (
                      <div className="text-center p-8">
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100 mb-6">
                          <h3 className="font-semibold text-green-800 flex items-center justify-center">
                            <Shield className="mr-2 text-green-600" size={18} /> 
                            Verification Complete
                          </h3>
                          <p className="text-green-700 text-sm mt-1">
                            Your identity has been verified successfully.
                          </p>
                        </div>
                        
                        <Button 
                          onClick={handleCompleteVerification}
                          className="w-full"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Processing...' : 'Complete Registration'}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Driver verification flow with additional steps */
                  <div className="space-y-6">
                    {!isAadhaarVerified ? (
                      <AadhaarVerification onVerified={(verified) => setIsAadhaarVerified(verified)} />
                    ) : !isDriverVerified ? (
                      <DriverVerification onVerified={(verified) => setIsDriverVerified(verified)} />
                    ) : (
                      <div className="text-center p-8">
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100 mb-6">
                          <h3 className="font-semibold text-green-800 flex items-center justify-center">
                            <Shield className="mr-2 text-green-600" size={18} /> 
                            All Verifications Complete
                          </h3>
                          <p className="text-green-700 text-sm mt-1">
                            Your identity and driver details have been verified successfully.
                          </p>
                        </div>
                        
                        <Button 
                          onClick={handleCompleteVerification}
                          className="w-full"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Processing...' : 'Complete Registration'}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setRegistrationStep(1)}
                  disabled={isLoading}
                >
                  Back to Account Details
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="shadow-lg border-none">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {isRegister ? 'Create an account' : 'Welcome back'}
                </CardTitle>
                <CardDescription>
                  {isRegister 
                    ? 'Enter your details to create your account' 
                    : 'Enter your credentials to access your account'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isRegister && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="name" 
                          placeholder="John Smith" 
                          className="pl-10"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="name@example.com" 
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      {!isRegister && (
                        <Link to="#" className="text-sm text-primary hover:underline">
                          Forgot password?
                        </Link>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {isRegister && (
                    <div className="space-y-2">
                      <Label>I want to join as</Label>
                      <RadioGroup 
                        defaultValue="passenger" 
                        value={userRole}
                        onValueChange={setUserRole}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                          <RadioGroupItem value="passenger" id="passenger" />
                          <Label htmlFor="passenger" className="flex items-center cursor-pointer">
                            <Users className="h-5 w-5 mr-2 text-primary" />
                            Passenger (Looking for rides)
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                          <RadioGroupItem value="driver" id="driver" />
                          <Label htmlFor="driver" className="flex items-center cursor-pointer">
                            <Car className="h-5 w-5 mr-2 text-primary" />
                            Driver (Offering rides)
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                  
                  {!isRegister && (
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </label>
                    </div>
                  )}
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Processing...' : (isRegister ? 'Continue' : 'Sign In')}
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-center w-full">
                  <p className="text-sm text-gray-600">
                    {isRegister 
                      ? 'Already have an account?' 
                      : 'Don\'t have an account?'}
                    <button
                      className="text-primary font-medium hover:underline ml-1"
                      onClick={() => setIsRegister(!isRegister)}
                      type="button"
                      disabled={isLoading}
                    >
                      {isRegister ? 'Sign in' : 'Create one'}
                    </button>
                  </p>
                </div>
                
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Button variant="outline" className="w-full" disabled={isLoading}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" className="w-full" disabled={isLoading}>
                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                    Facebook
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;






