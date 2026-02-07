export interface TripInput {
  destination: string;
  days: number;
  budget: number;
  travelType: 'solo' | 'friends' | 'family';
}

export interface Activity {
  time: string;
  activity: string;
  duration: string;
  cost: string;
}

export interface DayItinerary {
  day: number;
  title: string;
  activities: Activity[];
}

export interface Budget {
  accommodation: number;
  food: number;
  transport: number;
  activities: number;
  total: number;
}

export interface Place {
  name: string;
  category: string;
  bestTime: string;
  estimatedCost: string;
}

export interface FoodSpot {
  name: string;
  cuisine: string;
  specialty: string;
  priceRange: string;
}

export interface TripPlan {
  itinerary: DayItinerary[];
  budget: Budget;
  places: Place[];
  food: FoodSpot[];
  tips: string[];
}