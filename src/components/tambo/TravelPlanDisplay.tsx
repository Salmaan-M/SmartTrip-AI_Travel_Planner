'use client';

import { DayItinerary, Budget, Place, FoodSpot } from '@/types/trip';
import ItineraryCard from '../ItineraryCard';
import BudgetCard from '../BudgetCard';
import TipsCard from '../TipsCard';
import PlacesList, { FoodList } from '../PlacesList';
import DownloadPlanButton from '../DownloadPlanButton';

interface TravelPlanDisplayProps {
  itinerary?: DayItinerary[];
  budget?: Budget;
  places?: Place[];
  food?: FoodSpot[];
  tips?: string[];
  title?: string;
  subtitle?: string;
}

export default function TravelPlanDisplay({
  itinerary = [],
  budget,
  places = [],
  food = [],
  tips = [],
  title = "Your Personalized 3-Day Itinerary",
  subtitle = "Complete plan with neighborhoods, attractions, dining, and pro tips",
}: TravelPlanDisplayProps) {
  return (
    <div id="travel-plan" className="w-full max-w-4xl mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="text-center mb-12 bg-linear-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 mb-3">
          {title}
        </h1>
        <p className="text-gray-600 text-lg">{subtitle}</p>
      </div>

      {/* Day-wise Itinerary */}
      {itinerary.length > 0 && (
        <div className="mb-12 bg-white rounded-2xl shadow-lg p-8 border-l-4 border-blue-500">
          <div className="flex items-center mb-6">
            <span className="text-3xl mr-3">📅</span>
            <h2 className="text-2xl font-bold text-gray-800">Day-wise Itinerary</h2>
          </div>
          <ItineraryCard itinerary={itinerary} />
        </div>
      )}

      {/* Budget Estimate */}
      {budget && (
        <div className="mb-12 bg-white rounded-2xl shadow-lg p-8 border-l-4 border-green-500">
          <div className="flex items-center mb-6">
            <span className="text-3xl mr-3">💰</span>
            <h2 className="text-2xl font-bold text-gray-800">Budget Breakdown</h2>
          </div>
          <BudgetCard budget={budget} />
        </div>
      )}

      {/* Places to Visit */}
      {places.length > 0 && (
        <PlacesList places={places} title="Top Places to Visit" emoji="🎯" />
      )}

      {/* Food Experiences */}
      {food.length > 0 && (
        <FoodList food={food} title="Must-Try Restaurants" emoji="🍽️" />
      )}

      {/* Travel Tips */}
      {tips.length > 0 && (
        <div className="mb-12 bg-white rounded-2xl shadow-lg p-8 border-l-4 border-purple-500">
          <div className="flex items-center mb-6">
            <span className="text-3xl mr-3">💡</span>
            <h2 className="text-2xl font-bold text-gray-800">Pro Tips</h2>
          </div>
          <TipsCard tips={tips} />
        </div>
      )}

      {/* Footer with Download */}
      <div className="mt-16 pt-8 border-t-2 border-gray-200">
        <div className="text-center">
          <p className="text-gray-600 mb-4 text-lg font-medium">
            Ready to explore Tokyo? 🌸
          </p>
          <DownloadPlanButton planId="travel-plan" />
        </div>
      </div>
    </div>
  );
}