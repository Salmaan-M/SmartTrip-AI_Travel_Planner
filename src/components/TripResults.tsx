import ItineraryCard from './ItineraryCard';
import BudgetCard from './BudgetCard';
import PlacesCard from './PlacesCard';
import FoodCard from './FoodCard';
import TipsCard from './TipsCard';
import { TripPlan } from '@/types/trip';

interface TripResultsProps {
  plan: TripPlan;
}

export default function TripResults({ plan }: TripResultsProps) {
  return (
    <div className="space-y-6">
      {/* Top row - Itinerary and Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ItineraryCard itinerary={plan.itinerary} />
        <BudgetCard budget={plan.budget} />
      </div>

      {/* Bottom row - Places, Food, Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PlacesCard places={plan.places} />
        <FoodCard food={plan.food} />
        <TipsCard tips={plan.tips} />
      </div>
    </div>
  );
}