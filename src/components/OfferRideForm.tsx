import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Car, Calendar as CalendarIcon, Clock, Users, Info, ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateCity } from '@/utils/cityValidator';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

const offerRideSchema = z.object({
  from: z.string().min(2, {
    message: "From location must be at least 2 characters.",
  }),
  fromDetail: z.string().min(5, {
    message: "Please provide more specific pickup details."
  }),
  to: z.string().min(2, {
    message: "To location must be at least 2 characters.",
  }),
  toDetail: z.string().min(5, {
    message: "Please provide more specific drop-off details."
  }),
  date: z.string().min(1, {
    message: "Date is required.",
  }),
  departureTime: z.string().min(1, {
    message: "Departure time is required.",
  }),
  arrivalTime: z.string().min(1, {
    message: "Estimated arrival time is required.",
  }),
  seatsAvailable: z.number().min(1, {
    message: "At least one seat must be available.",
  }).max(8, {
    message: "Maximum 8 seats allowed."
  }),
  carModel: z.string().min(3, {
    message: "Car model is required."
  }),
  price: z.string().optional(),
  additionalInfo: z.string().optional(),
  amenities: z.array(z.string()).optional(),
});

type OfferRideFormValues = z.infer<typeof offerRideSchema>;

const amenitiesOptions = [
  "AC", "WiFi", "Water Bottle", "Music", "Charging Point", "Snacks", "Breakfast"
];

interface OfferRideFormProps {
  onClose?: () => void;
}

const OfferRideForm = ({ onClose }: OfferRideFormProps) => {
  const [validatingCity, setValidatingCity] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [carouselApi, setCarouselApi] = useState<any>(null);
  const { toast } = useToast();
  
  const form = useForm<OfferRideFormValues>({
    resolver: zodResolver(offerRideSchema),
    defaultValues: {
      from: "",
      fromDetail: "",
      to: "",
      toDetail: "",
      date: new Date().toISOString().split('T')[0],
      departureTime: "",
      arrivalTime: "",
      seatsAvailable: 1,
      carModel: "",
      additionalInfo: "",
      amenities: [],
    },
  });

  const calculateEstimatedPrice = async (from: string, to: string) => {
    if (!from || !to) return "";
    
    try {
      const distanceKm = Math.floor(Math.random() * 300) + 50; // 50-350km random distance
      const pricePerKm = 18; // ₹18 per km as specified
      const totalPrice = distanceKm * pricePerKm;
      
      return totalPrice.toLocaleString('en-IN');
    } catch (error) {
      console.error("Error calculating price:", error);
      return "";
    }
  };

  const handleCityBlur = async (field: "from" | "to", value: string) => {
    if (!value) return;
    
    setValidatingCity(true);
    const isValid = await validateCity(value);
    setValidatingCity(false);
    
    if (!isValid) {
      form.setError(field, {
        type: "manual",
        message: `"${value}" doesn't seem to be a valid city. Please check the spelling.`
      });
    } else {
      form.clearErrors(field);
      
      const otherField = field === "from" ? "to" : "from";
      const otherValue = form.getValues(otherField);
      if (otherValue) {
        const price = await calculateEstimatedPrice(
          field === "from" ? value : otherValue,
          field === "to" ? value : otherValue
        );
        form.setValue("price", price);
      }
    }
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => {
      if (prev.includes(amenity)) {
        return prev.filter(a => a !== amenity);
      } else {
        return [...prev, amenity];
      }
    });
  };

  useEffect(() => {
    if (carouselApi) {
      carouselApi.scrollTo(activeStep);
    }
  }, [activeStep, carouselApi]);

  const nextStep = () => {
    if (activeStep === 0) {
      form.trigger(["from", "to", "fromDetail", "toDetail"]).then(isValid => {
        if (isValid) setActiveStep(prev => prev + 1);
      });
    } else if (activeStep === 1) {
      form.trigger(["date", "departureTime", "arrivalTime"]).then(isValid => {
        if (isValid) setActiveStep(prev => prev + 1);
      });
    } else if (activeStep === 2) {
      form.trigger(["carModel", "seatsAvailable"]).then(isValid => {
        if (isValid) setActiveStep(prev => prev + 1);
      });
    } else if (activeStep < 3) {
      setActiveStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const onSubmit = async (data: OfferRideFormValues) => {
    data.amenities = selectedAmenities;
    
    const rideId = Date.now();
    const newRide = {
      id: rideId,
      ...data,
      driverName: JSON.parse(localStorage.getItem('elitecars_current_user') || '{}').name || 'Unknown Driver',
      driverRating: 4.5,
      verified: true,
      rating: 4.5,
      date: new Date(data.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    };
    
    const existingRides = JSON.parse(localStorage.getItem('elitecars_offered_rides') || '[]');
    const updatedRides = [...existingRides, newRide];
    
    localStorage.setItem('elitecars_offered_rides', JSON.stringify(updatedRides));
    
    toast({
      title: "Ride Offered Successfully",
      description: `Your ride from ${data.from} to ${data.to} has been published.`,
    });
    
    form.reset();
    setSelectedAmenities([]);
    
    if (onClose) {
      onClose();
    }
  };

  const steps = [
    {
      title: "Route & Locations",
      icon: <MapPin size={18} className="mr-2 text-primary" />
    },
    {
      title: "Journey Details",
      icon: <CalendarIcon size={18} className="mr-2 text-primary" />
    },
    {
      title: "Vehicle Details",
      icon: <Car size={18} className="mr-2 text-primary" />
    },
    {
      title: "Amenities & Extras",
      icon: <Info size={18} className="mr-2 text-primary" />
    }
  ];

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 max-w-2xl mx-auto relative">
      {onClose && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute top-4 left-4 p-2"
          onClick={onClose}
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Button>
      )}
      
      <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center justify-center">
        <span className="bg-primary/10 text-primary p-2 rounded-full mr-3">
          <Car size={20} />
        </span>
        Offer a Ride
      </h2>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center relative ${index <= activeStep ? 'text-primary' : 'text-gray-400'}`}
              style={{ width: `${100 / steps.length}%` }}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${index < activeStep ? 'bg-primary text-white' : index === activeStep ? 'bg-primary/20 border-2 border-primary' : 'bg-gray-200'}`}>
                {index < activeStep ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className="text-xs font-medium text-center hidden md:block">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Carousel className="w-full" setApi={setCarouselApi}>
            <CarouselContent>
              <CarouselItem>
                <Card className="border-none shadow-none">
                  <CardContent className="p-0">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-700 flex items-center">
                        <MapPin size={18} className="mr-2 text-primary" />
                        Route & Locations
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="from"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>From City/Town</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g. Mumbai" 
                                {...field}
                                onBlur={() => handleCityBlur("from", field.value)}
                                className="border border-gray-300"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="fromDetail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Exact Pickup Location</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g. Andheri West Metro Station" 
                                {...field}
                                className="border border-gray-300"
                              />
                            </FormControl>
                            <FormDescription>
                              Specific area or landmark for easier pickup
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="to"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>To City/Town</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g. Pune" 
                                {...field}
                                onBlur={() => handleCityBlur("to", field.value)}
                                className="border border-gray-300"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="toDetail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Exact Drop-off Location</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g. Koregaon Park" 
                                {...field}
                                className="border border-gray-300"
                              />
                            </FormControl>
                            <FormDescription>
                              Specific area or landmark for drop-off
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
              
              <CarouselItem>
                <Card className="border-none shadow-none">
                  <CardContent className="p-0">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-700 flex items-center">
                        <CalendarIcon size={18} className="mr-2 text-primary" />
                        Journey Details
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                {...field}
                                min={new Date().toISOString().split('T')[0]}
                                className="border border-gray-300"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="departureTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Departure Time</FormLabel>
                              <FormControl>
                                <Input 
                                  type="time" 
                                  {...field}
                                  className="border border-gray-300"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="arrivalTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estimated Arrival</FormLabel>
                              <FormControl>
                                <Input 
                                  type="time" 
                                  {...field}
                                  className="border border-gray-300"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="border-t border-b py-4 border-gray-200">
                        <h4 className="text-lg font-semibold mb-2 text-slate-700">Estimated Fare</h4>
                        
                        <div className="flex items-center">
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <div className="flex items-center">
                                <span className="text-3xl font-bold text-slate-800">₹</span>
                                <Input 
                                  className="text-2xl font-bold border-none w-32 text-slate-800 p-0 pl-1 focus-visible:ring-0 disabled:opacity-100"
                                  {...field}
                                  disabled
                                />
                              </div>
                            )}
                          />
                          
                          <div className="ml-3 bg-blue-50 p-2 rounded-md text-sm text-blue-700">
                            <Info size={16} className="inline-block mr-1" />
                            Based on distance @ ₹18/km
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1">
                          The exact fare will be calculated based on the actual distance.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
              
              <CarouselItem>
                <Card className="border-none shadow-none">
                  <CardContent className="p-0">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-700 flex items-center">
                        <Car size={18} className="mr-2 text-primary" />
                        Vehicle & Seat Details
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="carModel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Car Model</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g. Toyota Innova" 
                                {...field}
                                className="border border-gray-300"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="seatsAvailable"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Available Seats: {field.value}</FormLabel>
                            <FormControl>
                              <Slider
                                defaultValue={[field.value]}
                                min={1}
                                max={8}
                                step={1}
                                onValueChange={(value) => field.onChange(value[0])}
                                className="py-4"
                              />
                            </FormControl>
                            <FormDescription>
                              Slide to select between 1 and 8 seats
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
              
              <CarouselItem>
                <Card className="border-none shadow-none">
                  <CardContent className="p-0">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-700 flex items-center">
                        <Info size={18} className="mr-2 text-primary" />
                        Amenities & Additional Info
                      </h3>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-3 text-slate-700">Amenities Available</h4>
                        <div className="flex flex-wrap gap-2">
                          {amenitiesOptions.map(amenity => (
                            <Button
                              key={amenity}
                              type="button"
                              variant={selectedAmenities.includes(amenity) ? "default" : "outline"}
                              size="sm"
                              className="h-8"
                              onClick={() => toggleAmenity(amenity)}
                            >
                              {amenity}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="additionalInfo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Information</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Anything else passengers should know? (luggage space, smoking policy, etc.)" 
                                {...field}
                                className="min-h-[100px] border border-gray-300"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
          
          <div className="flex justify-between mt-6">
            <Button 
              type="button" 
              variant="outline"
              onClick={prevStep}
              disabled={activeStep === 0}
              className="flex items-center"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            
            {activeStep < steps.length - 1 ? (
              <Button 
                type="button"
                onClick={nextStep}
                className="flex items-center"
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary btn-shine shadow-md"
              >
                Publish Ride Offer
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OfferRideForm;
