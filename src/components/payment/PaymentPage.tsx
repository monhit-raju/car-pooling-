
import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Smartphone, Wallet, Building, Tag, CheckCircle, 
  Shield, Lock, X, ChevronDown, ChevronUp, Trash2, Edit, 
  AlertCircle, IndianRupee, MapPin, Car, User, Clock, Calendar as CalendarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Ride } from '@/data/rides';
import { useToast } from '@/hooks/use-toast';
import { PassengerDetail } from '@/components/PassengerDetailsForm';
import { Calendar } from '@/components/ui/calendar';

// Saved card type
interface SavedCard {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  isDefault: boolean;
  cardType: 'visa' | 'mastercard' | 'rupay' | 'amex';
}

// Payment method type
type PaymentMethod = 'card' | 'upi' | 'wallet' | 'netbanking';

// Payment page props
interface PaymentPageProps {
  ride: Ride;
  passengerDetails: PassengerDetail[];
  onPaymentComplete: () => void;
  onCancel: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ ride, passengerDetails, onPaymentComplete, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('trip-summary');
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [selectedSavedCard, setSelectedSavedCard] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock saved cards - in a real app, these would come from an API/database
  const [savedCards, setSavedCards] = useState<SavedCard[]>([
    {
      id: '1',
      cardNumber: '•••• •••• •••• 4242',
      cardHolder: 'John Doe',
      expiryDate: '12/25',
      isDefault: true,
      cardType: 'visa'
    },
    {
      id: '2',
      cardNumber: '•••• •••• •••• 5555',
      cardHolder: 'John Doe',
      expiryDate: '10/24',
      isDefault: false,
      cardType: 'mastercard'
    }
  ]);

  // Banks for net banking
  const popularBanks = [
    { id: 'sbi', name: 'State Bank of India' },
    { id: 'hdfc', name: 'HDFC Bank' },
    { id: 'icici', name: 'ICICI Bank' },
    { id: 'axis', name: 'Axis Bank' }
  ];

  // Wallets
  const wallets = [
    { id: 'paytm', name: 'Paytm' },
    { id: 'amazonpay', name: 'Amazon Pay' },
    { id: 'phonepe', name: 'PhonePe' },
    { id: 'mobikwik', name: 'MobiKwik' }
  ];

  // Format card number with spaces
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

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  // Handle card number input
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };
  
  // Handle expiry date input
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setExpiryDate(formattedValue);
  };

  // Toggle section expand/collapse
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Apply coupon
  const applyCoupon = () => {
    if (!couponCode) {
      toast({
        title: "Please enter a coupon code",
        variant: "destructive"
      });
      return;
    }

    // Mock coupon validation - in a real app, this would be an API call
    if (couponCode.toUpperCase() === 'ELITE20') {
      toast({
        title: "Coupon applied!",
        description: "You got 20% off on your ride",
      });
      setAppliedCoupon({ code: couponCode.toUpperCase(), discount: 20 });
    } else if (couponCode.toUpperCase() === 'WELCOME10') {
      toast({
        title: "Coupon applied!",
        description: "You got 10% off on your ride",
      });
      setAppliedCoupon({ code: couponCode.toUpperCase(), discount: 10 });
    } else {
      toast({
        title: "Invalid coupon",
        description: "This coupon code is not valid or has expired",
        variant: "destructive"
      });
    }

    setCouponCode('');
  };

  // Remove applied coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast({
      title: "Coupon removed",
    });
  };

  // Delete saved card
  const deleteSavedCard = (cardId: string) => {
    setSavedCards(savedCards.filter(card => card.id !== cardId));
    if (selectedSavedCard === cardId) {
      setSelectedSavedCard(null);
    }
    toast({
      title: "Card removed",
      description: "Your saved card has been removed",
    });
  };

  // Calculate fare breakdown
  const calculateFare = () => {
    const baseFare = parseInt(ride.price.replace(/,/g, ''));
    const totalPassengers = passengerDetails.length;
    const totalBaseFare = baseFare * totalPassengers;
    const convenienceFee = Math.round(totalBaseFare * 0.05); // 5% convenience fee
    const taxes = Math.round(totalBaseFare * 0.18); // 18% GST
    
    let discount = 0;
    if (appliedCoupon) {
      discount = Math.round((totalBaseFare + convenienceFee + taxes) * (appliedCoupon.discount / 100));
    }
    
    const totalFare = totalBaseFare + convenienceFee + taxes - discount;
    
    return {
      baseFare: totalBaseFare,
      convenienceFee,
      taxes,
      discount,
      totalFare
    };
  };

  // Handle payment
  const handlePayment = () => {
    if (!paymentMethod) {
      toast({
        title: "Please select a payment method",
        variant: "destructive"
      });
      return;
    }

    // Validate payment details based on selected method
    if (paymentMethod === 'card' && !selectedSavedCard) {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        toast({
          title: "Invalid card number",
          description: "Please enter a valid 16-digit card number",
          variant: "destructive"
        });
        return;
      }
      
      if (!expiryDate || expiryDate.length < 5) {
        toast({
          title: "Invalid expiry date",
          description: "Please enter a valid expiry date (MM/YY)",
          variant: "destructive"
        });
        return;
      }
      
      if (!cvv || cvv.length < 3) {
        toast({
          title: "Invalid CVV",
          description: "Please enter a valid 3-digit CVV",
          variant: "destructive"
        });
        return;
      }
      
      if (!cardHolder) {
        toast({
          title: "Missing card holder name",
          description: "Please enter the name on your card",
          variant: "destructive"
        });
        return;
      }
    } else if (paymentMethod === 'upi' && (!upiId || !upiId.includes('@'))) {
      toast({
        title: "Invalid UPI ID",
        description: "Please enter a valid UPI ID (e.g., name@upi)",
        variant: "destructive"
      });
      return;
    } else if (paymentMethod === 'netbanking' && !selectedBank) {
      toast({
        title: "Please select a bank",
        variant: "destructive"
      });
      return;
    } else if (paymentMethod === 'wallet' && !selectedWallet) {
      toast({
        title: "Please select a wallet",
        variant: "destructive"
      });
      return;
    }

    // Simulate payment processing
    setIsProcessing(true);
    
    toast({
      title: "Processing payment",
      description: "Please wait while we process your payment...",
    });
    
    // Simulate API call with a delay
    setTimeout(() => {
      setIsProcessing(false);
      
      toast({
        title: "Payment successful!",
        description: `Your payment of ₹${calculateFare().totalFare.toLocaleString('en-IN')} has been processed successfully.`,
      });
      
      // If the user chose to save their card, do it here (in a real app)
      if (paymentMethod === 'card' && !selectedSavedCard && saveCard && cardNumber) {
        const lastFour = cardNumber.replace(/\s/g, '').slice(-4);
        const newCard: SavedCard = {
          id: Date.now().toString(),
          cardNumber: `•••• •••• •••• ${lastFour}`,
          cardHolder,
          expiryDate,
          isDefault: false,
          cardType: 'visa' // This would be determined by the card number in a real app
        };
        
        setSavedCards([...savedCards, newCard]);
      }
      
      // Complete the payment flow
      onPaymentComplete();
    }, 2000);
  };

  // Fare breakdown values
  const fareBreakdown = calculateFare();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Complete your booking</h2>
        <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full">
          <X size={20} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Trip summary and payment methods */}
        <div className="md:col-span-2 space-y-6">
          {/* Trip Summary Card */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('trip-summary')}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Car className="mr-2 text-primary" size={20} />
                  Trip Summary
                </CardTitle>
                {expandedSection === 'trip-summary' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </CardHeader>
            {expandedSection === 'trip-summary' && (
              <CardContent>
                <div className="space-y-4">
                  {/* Trip route */}
                  <div className="relative pl-7 space-y-3">
                    <div className="absolute left-2 top-1 h-full w-0.5 bg-primary/20"></div>
                    <div>
                      <div className="absolute left-0 top-0 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      </div>
                      <p className="font-medium">{ride.from}</p>
                      <p className="text-sm text-gray-600">{ride.fromDetail}</p>
                    </div>
                    <div className="relative">
                      <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-accent flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      </div>
                      <p className="font-medium">{ride.to}</p>
                      <p className="text-sm text-gray-600">{ride.toDetail}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-between gap-4 text-sm">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1 text-primary" />
                      <span>{ride.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-primary" />
                      <span>{ride.departureTime}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1 text-primary" />
                      <span>{passengerDetails.length} {passengerDetails.length === 1 ? 'passenger' : 'passengers'}</span>
                    </div>
                  </div>

                  {/* Driver and vehicle info */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{ride.driverName}</p>
                        <div className="flex items-center text-sm text-gray-600">
                          <Car className="h-3.5 w-3.5 mr-1" />
                          <span>{ride.carModel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Payment Methods Card */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('payment-methods')}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <CreditCard className="mr-2 text-primary" size={20} />
                  Payment Methods
                </CardTitle>
                {expandedSection === 'payment-methods' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </CardHeader>
            {expandedSection === 'payment-methods' && (
              <CardContent>
                <RadioGroup 
                  value={paymentMethod || ''} 
                  onValueChange={(value: string) => setPaymentMethod(value as PaymentMethod)}
                  className="space-y-4"
                >
                  {/* Credit/Debit Card */}
                  <div className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <RadioGroupItem value="card" id="card" className="mr-2" />
                        <Label htmlFor="card" className="font-medium flex items-center cursor-pointer">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Credit / Debit Card
                        </Label>
                      </div>
                      <div className="flex gap-1">
                        <div className="h-6 w-10 rounded-sm bg-blue-600 flex items-center justify-center text-white text-xs font-bold">VISA</div>
                        <div className="h-6 w-10 rounded-sm bg-orange-600 flex items-center justify-center text-white text-xs font-bold">MC</div>
                        <div className="h-6 w-10 rounded-sm bg-green-600 flex items-center justify-center text-white text-xs font-bold">RuPay</div>
                      </div>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="pl-6 mt-4 space-y-4">
                        {/* Saved Cards */}
                        {savedCards.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm text-gray-700">Saved Cards</h4>
                            {savedCards.map(card => (
                              <div 
                                key={card.id} 
                                className={`border rounded-md p-3 flex justify-between items-center cursor-pointer transition-colors ${selectedSavedCard === card.id ? 'border-primary bg-primary/5' : 'hover:border-gray-300'}`}
                                onClick={() => setSelectedSavedCard(card.id)}
                              >
                                <div className="flex items-center">
                                  <div className={`h-6 w-10 rounded-sm mr-3 flex items-center justify-center text-white text-xs font-bold ${
                                    card.cardType === 'visa' ? 'bg-blue-600' : 
                                    card.cardType === 'mastercard' ? 'bg-orange-600' : 
                                    card.cardType === 'rupay' ? 'bg-green-600' : 'bg-gray-600'
                                  }`}>
                                    {card.cardType === 'visa' ? 'VISA' : 
                                     card.cardType === 'mastercard' ? 'MC' : 
                                     card.cardType === 'rupay' ? 'RuPay' : 'AMEX'}
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{card.cardNumber}</p>
                                    <p className="text-xs text-gray-500">Expires {card.expiryDate}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {card.isDefault && (
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Default</span>
                                  )}
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7 rounded-full hover:bg-red-50 hover:text-red-500"
                                    onClick={(e) => {
                                      e.stopPropagation(); 
                                      deleteSavedCard(card.id);
                                    }}
                                  >
                                    <Trash2 size={15} />
                                  </Button>
                                </div>
                              </div>
                            ))}
                            
                            <div className="flex items-center">
                              <Button 
                                variant="link" 
                                className="p-0 h-auto text-primary text-sm font-normal"
                                onClick={() => setSelectedSavedCard(null)}
                              >
                                + Add a new card
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* New Card Form */}
                        {(savedCards.length === 0 || !selectedSavedCard) && (
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="cardNumber" className="text-sm">Card Number</Label>
                              <Input
                                id="cardNumber"
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                maxLength={19}
                                className="mt-1"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="cardHolder" className="text-sm">Name on Card</Label>
                              <Input
                                id="cardHolder"
                                type="text"
                                placeholder="John Smith"
                                value={cardHolder}
                                onChange={(e) => setCardHolder(e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label htmlFor="expiryDate" className="text-sm">Expiry Date</Label>
                                <Input
                                  id="expiryDate"
                                  type="text"
                                  placeholder="MM/YY"
                                  value={expiryDate}
                                  onChange={handleExpiryDateChange}
                                  maxLength={5}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor="cvv" className="text-sm">CVV</Label>
                                <Input
                                  id="cvv"
                                  type="text"
                                  placeholder="123"
                                  value={cvv}
                                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                  maxLength={3}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <input
                                id="saveCard"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                checked={saveCard}
                                onChange={() => setSaveCard(!saveCard)}
                              />
                              <Label htmlFor="saveCard" className="ml-2 text-sm">
                                Save this card for future payments
                              </Label>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* UPI */}
                  <div className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <RadioGroupItem value="upi" id="upi" className="mr-2" />
                        <Label htmlFor="upi" className="font-medium flex items-center cursor-pointer">
                          <Smartphone className="h-4 w-4 mr-2" />
                          UPI
                        </Label>
                      </div>
                      <div className="flex gap-1">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Instant Payment</span>
                      </div>
                    </div>

                    {paymentMethod === 'upi' && (
                      <div className="pl-6 mt-4">
                        <div>
                          <Label htmlFor="upiId" className="text-sm">UPI ID / VPA</Label>
                          <Input
                            id="upiId"
                            type="text"
                            placeholder="name@upi"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Examples: mobilenumber@upi, username@okbank
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Wallets */}
                  <div className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors">
                    <div className="flex items-center">
                      <RadioGroupItem value="wallet" id="wallet" className="mr-2" />
                      <Label htmlFor="wallet" className="font-medium flex items-center cursor-pointer">
                        <Wallet className="h-4 w-4 mr-2" />
                        Mobile Wallets
                      </Label>
                    </div>

                    {paymentMethod === 'wallet' && (
                      <div className="pl-6 mt-4 grid grid-cols-2 gap-3">
                        {wallets.map(wallet => (
                          <div 
                            key={wallet.id}
                            className={`border rounded-md p-3 flex items-center cursor-pointer transition-colors ${selectedWallet === wallet.id ? 'border-primary bg-primary/5' : 'hover:border-gray-300'}`}
                            onClick={() => setSelectedWallet(wallet.id)}
                          >
                            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                              {wallet.id.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-sm">{wallet.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Net Banking */}
                  <div className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors">
                    <div className="flex items-center">
                      <RadioGroupItem value="netbanking" id="netbanking" className="mr-2" />
                      <Label htmlFor="netbanking" className="font-medium flex items-center cursor-pointer">
                        <Building className="h-4 w-4 mr-2" />
                        Net Banking
                      </Label>
                    </div>

                    {paymentMethod === 'netbanking' && (
                      <div className="pl-6 mt-4">
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Popular Banks</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {popularBanks.map(bank => (
                            <div 
                              key={bank.id}
                              className={`border rounded-md p-3 flex items-center cursor-pointer transition-colors ${selectedBank === bank.id ? 'border-primary bg-primary/5' : 'hover:border-gray-300'}`}
                              onClick={() => setSelectedBank(bank.id)}
                            >
                              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                {bank.name.charAt(0)}
                              </div>
                              <span className="font-medium text-sm">{bank.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </RadioGroup>
              </CardContent>
            )}
          </Card>

          {/* Coupons Card */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('coupons')}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Tag className="mr-2 text-primary" size={20} />
                  Coupons & Offers
                </CardTitle>
                {expandedSection === 'coupons' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </CardHeader>
            {expandedSection === 'coupons' && (
              <CardContent>
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="uppercase"
                    />
                    <Button onClick={applyCoupon}>Apply</Button>
                  </div>
                ) : (
                  <div className="border border-green-100 bg-green-50 rounded-lg p-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <p className="font-medium text-green-800">{appliedCoupon.code}</p>
                        <p className="text-xs text-green-700">{appliedCoupon.discount}% off applied to your total</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeCoupon} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0 h-7 w-7">
                      <X size={16} />
                    </Button>
                  </div>
                )}
                
                <div className="mt-4">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Available Offers</h4>
                  <div className="space-y-3">
                    <div className="border rounded-md p-3">
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 text-primary mr-2" />
                        <p className="font-medium text-sm">ELITE20</p>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Get 20% off up to ₹100 on your first ride with Elite Cars Connect</p>
                    </div>
                    <div className="border rounded-md p-3">
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 text-primary mr-2" />
                        <p className="font-medium text-sm">WELCOME10</p>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Get 10% off on all rides. Valid for new users only</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Right column - Fare Details */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">Fare Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Base Fare ({passengerDetails.length} {passengerDetails.length === 1 ? 'passenger' : 'passengers'})</span>
                  <span>₹{fareBreakdown.baseFare.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Convenience Fee</span>
                  <span>₹{fareBreakdown.convenienceFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Taxes (18% GST)</span>
                  <span>₹{fareBreakdown.taxes.toLocaleString('en-IN')}</span>
                </div>
                
                {fareBreakdown.discount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span className="text-sm">Discount ({appliedCoupon?.code})</span>
                    <span>- ₹{fareBreakdown.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-3 mt-2">
                  <div className="flex justify-between items-center font-bold">
                    <span>Total Amount</span>
                    <span className="text-lg">₹{fareBreakdown.totalFare.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full mt-6"
                disabled={!paymentMethod || isProcessing}
                onClick={handlePayment}
              >
                {isProcessing ? 'Processing...' : `Pay ₹${fareBreakdown.totalFare.toLocaleString('en-IN')}`}
              </Button>
              
              <div className="flex flex-col items-center mt-4 gap-2">
                <div className="flex items-center text-xs text-gray-600">
                  <Lock className="h-3 w-3 mr-1" />
                  <span>Your payment information is securely encrypted</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 bg-gray-100 rounded px-2 flex items-center">
                    <Shield className="h-3 w-3 text-gray-700 mr-1" />
                    <span className="text-xs">100% Secure</span>
                  </div>
                  <div className="h-6 bg-gray-100 rounded px-2 flex items-center">
                    <Lock className="h-3 w-3 text-gray-700 mr-1" />
                    <span className="text-xs">SSL Encrypted</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

