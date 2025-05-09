
export interface Ride {
  id: number;
  from: string;
  fromDetail: string;
  to: string;
  toDetail: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  price: string;
  driverName: string;
  driverRating: number;
  carModel: string;
  seatsAvailable: number;
  verified: boolean;
  rating: number;
  amenities: string[];
  status?: 'active' | 'completed' | 'cancelled';
}

export const rides: Ride[] = [
  {
    id: 1,
    from: "Delhi",
    fromDetail: "Connaught Place",
    to: "Jaipur",
    toDetail: "City Palace",
    date: "Apr 15, 2025",
    departureTime: "08:00 AM",
    arrivalTime: "02:30 PM",
    price: "1,199",
    driverName: "Rajesh Singh",
    driverRating: 4.8,
    carModel: "Toyota Innova",
    seatsAvailable: 3,
    verified: true,
    rating: 4.8,
    amenities: ["AC", "Water Bottle", "Music"]
  },
  {
    id: 2,
    from: "Mumbai",
    fromDetail: "Bandra West",
    to: "Pune",
    toDetail: "Koregaon Park",
    date: "Apr 16, 2025",
    departureTime: "09:30 AM",
    arrivalTime: "12:45 PM",
    price: "899",
    driverName: "Priya Sharma",
    driverRating: 4.7,
    carModel: "Honda City",
    seatsAvailable: 2,
    verified: true,
    rating: 4.7,
    amenities: ["AC", "WiFi", "Snacks"]
  },
  {
    id: 3,
    from: "Bangalore",
    fromDetail: "Indiranagar",
    to: "Mysore",
    toDetail: "Mysore Palace",
    date: "Apr 14, 2025",
    departureTime: "10:00 AM",
    arrivalTime: "01:30 PM",
    price: "849",
    driverName: "Karthik Raj",
    driverRating: 4.5,
    carModel: "Maruti Swift",
    seatsAvailable: 3,
    verified: false,
    rating: 4.5,
    amenities: ["AC", "Water Bottle"]
  },
  {
    id: 4,
    from: "Chennai",
    fromDetail: "T Nagar",
    to: "Pondicherry",
    toDetail: "Rock Beach",
    date: "Apr 17, 2025",
    departureTime: "07:30 AM",
    arrivalTime: "11:00 AM",
    price: "1,049",
    driverName: "Lakshmi Narayanan",
    driverRating: 4.9,
    carModel: "Hyundai Creta",
    seatsAvailable: 4,
    verified: true,
    rating: 4.9,
    amenities: ["AC", "WiFi", "Snacks", "Water Bottle"]
  },
  {
    id: 5,
    from: "Hyderabad",
    fromDetail: "Banjara Hills",
    to: "Warangal",
    toDetail: "Warangal Fort",
    date: "Apr 18, 2025",
    departureTime: "08:30 AM",
    arrivalTime: "11:45 AM",
    price: "899",
    driverName: "Mohammed Aziz",
    driverRating: 4.6,
    carModel: "Tata Nexon",
    seatsAvailable: 2,
    verified: false,
    rating: 4.6,
    amenities: ["AC", "Water Bottle", "Charging Point"]
  },
  {
    id: 6,
    from: "Kolkata",
    fromDetail: "Park Street",
    to: "Digha",
    toDetail: "Digha Beach",
    date: "Apr 19, 2025",
    departureTime: "06:00 AM",
    arrivalTime: "11:30 AM",
    price: "1,349",
    driverName: "Sourav Ghosh",
    driverRating: 4.8,
    carModel: "Mahindra XUV",
    seatsAvailable: 5,
    verified: true,
    rating: 4.8,
    amenities: ["AC", "WiFi", "Breakfast", "Water Bottle"]
  },
  {
    id: 7,
    from: "Delhi",
    fromDetail: "Karol Bagh",
    to: "Agra",
    toDetail: "Taj Mahal",
    date: "Apr 20, 2025",
    departureTime: "07:00 AM",
    arrivalTime: "10:30 AM",
    price: "999",
    driverName: "Ananya Gupta",
    driverRating: 4.7,
    carModel: "Maruti Dzire",
    seatsAvailable: 3,
    verified: true,
    rating: 4.7,
    amenities: ["AC", "Water Bottle", "Tour Guide"]
  },
  {
    id: 8,
    from: "Bangalore",
    fromDetail: "Koramangala",
    to: "Coorg",
    toDetail: "Madikeri",
    date: "Apr 21, 2025",
    departureTime: "06:30 AM",
    arrivalTime: "11:45 AM",
    price: "1,499",
    driverName: "Vignesh Kumar",
    driverRating: 4.9,
    carModel: "Toyota Fortuner",
    seatsAvailable: 6,
    verified: true,
    rating: 4.9,
    amenities: ["AC", "WiFi", "Breakfast", "Music", "Charging Point"]
  },
  {
    id: 9,
    from: "Mumbai",
    fromDetail: "Andheri West",
    to: "Lonavala",
    toDetail: "Lonavala Lake",
    date: "Apr 16, 2025",
    departureTime: "08:00 AM",
    arrivalTime: "10:00 AM",
    price: "749",
    driverName: "Rohan Joshi",
    driverRating: 4.6,
    carModel: "Honda Amaze",
    seatsAvailable: 2,
    verified: false,
    rating: 4.6,
    amenities: ["AC", "Water Bottle"]
  }
];

