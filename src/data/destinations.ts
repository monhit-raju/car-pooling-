
interface Destination {
  id: number;
  from: string;
  to: string;
  price: string;
  imageUrl: string;
  rideCount: number;
}

export const popularDestinations: Destination[] = [
  {
    id: 1,
    from: "Delhi",
    to: "Jaipur",
    price: "1,200",
    imageUrl: "https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rideCount: 45
  },
  {
    id: 2,
    from: "Mumbai",
    to: "Pune",
    price: "950",
    imageUrl: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rideCount: 32
  },
  {
    id: 3,
    from: "Bangalore",
    to: "Mysore",
    price: "850",
    imageUrl: "https://images.unsplash.com/photo-1570521462033-3015e76e7432?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rideCount: 28
  },
  {
    id: 4,
    from: "Chennai",
    to: "Pondicherry",
    price: "1,100",
    imageUrl: "https://images.unsplash.com/photo-1596018589890-7681806a1f62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rideCount: 19
  },
  {
    id: 5,
    from: "Hyderabad",
    to: "Warangal",
    price: "920",
    imageUrl: "https://images.unsplash.com/photo-1564495524928-eae5c9b09a7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rideCount: 15
  },
  {
    id: 6,
    from: "Kolkata",
    to: "Digha",
    price: "1,350",
    imageUrl: "https://images.unsplash.com/photo-1526667900882-7b1392ae8c07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rideCount: 23
  }
];
