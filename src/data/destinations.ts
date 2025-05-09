
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
    imageUrl: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rideCount: 19
  },
  
  {
    id: 6,
    from: "Kolkata",
    to: "Digha",
    price: "1,350",
    imageUrl: "https://images.unsplash.com/photo-1536421469767-80559bb6f5e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rideCount: 23
  },
  {
    id: 7,
    from: "Delhi",
    to: "Agra",
    price: "999",
    imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rideCount: 38
  },
  {
    id: 8,
    from: "Bangalore",
    to: "Coorg",
    price: "1,499",
    imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rideCount: 27
  },
  
  {
    id: 10,
    from: "Ahmedabad",
    to: "Vadodara",
    price: "680",
    imageUrl: "https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rideCount: 22
  },
  {
    id: 11,
    from: "Jaipur",
    to: "Udaipur",
    price: "1,250",
    imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rideCount: 18
  },
  
];

// Additional destinations data can be added here
export const recentDestinations = popularDestinations.slice(0, 4);
export const trendingDestinations = [...popularDestinations].sort((a, b) => b.rideCount - a.rideCount).slice(0, 4);


