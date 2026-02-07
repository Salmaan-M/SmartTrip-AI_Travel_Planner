'use client';

import { DayItinerary, Budget, Place, FoodSpot } from '@/types/trip';
import ItineraryCard from '../ItineraryCard';
import BudgetCard from '../BudgetCard';
import PlacesCard from '../PlacesCard';
import FoodCard from '../FoodCard';
import TipsCard from '../TipsCard';

interface TravelPlanDisplayProps {
  itinerary: DayItinerary[];
  budget: Budget;
  places: Place[];
  food: FoodSpot[];
  tips: string[];
}

export default function TravelPlanDisplay({
  itinerary,
  budget,
  places,
  food,
  tips,
}: TravelPlanDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Top row - Itinerary and Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ItineraryCard itinerary={itinerary} />
        <BudgetCard budget={budget} />
      </div>

      {/* Bottom row - Places, Food, Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PlacesCard places={places} />
        <FoodCard food={food} />
        <TipsCard tips={tips} />
      </div>
    </div>
  );
}