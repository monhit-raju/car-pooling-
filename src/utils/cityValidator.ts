
// A utility to validate if a city name is valid

// This is a simplified version for the demo
// In a real app, this would connect to a geocoding API like Google Maps or Mapbox
export const validateCity = async (cityName: string): Promise<boolean> => {
  // Simulate API call with a timeout
  return new Promise(resolve => {
    setTimeout(() => {
      // List of major Indian cities for validation
      const majorIndianCities = [
        "mumbai", "delhi", "bangalore", "hyderabad", "chennai", "kolkata", 
        "pune", "jaipur", "ahmedabad", "surat", "lucknow", "kanpur", 
        "nagpur", "indore", "thane", "bhopal", "visakhapatnam", "patna", 
        "vadodara", "ghaziabad", "ludhiana", "agra", "nashik", "faridabad", 
        "meerut", "rajkot", "varanasi", "srinagar", "aurangabad", "dhanbad", 
        "amritsar", "navi mumbai", "allahabad", "ranchi", "howrah", "coimbatore", 
        "jabalpur", "gwalior", "vijayawada", "jodhpur", "madurai", "raipur",
        "kochi", "chandigarh", "mysore", "gurgaon", "noida", "dehradun"
      ];
      
      // Check if the input city exists in our list (case-insensitive)
      const isValid = majorIndianCities.some(
        city => city.toLowerCase() === cityName.toLowerCase()
      );
      
      resolve(isValid);
    }, 1000); // Simulate network delay
  });
};
