'use client';

import { Place, FoodSpot } from '@/types/trip';

interface PlacesListProps {
  places: Place[];
  title: string;
  emoji: string;
}

export default function PlacesList({ places, title, emoji }: PlacesListProps) {
  const displayPlaces = places.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-orange-500 mb-8">
      <div className="flex items-center mb-6">
        <span className="text-3xl mr-3">{emoji}</span>
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
      </div>
      
      <div className="space-y-4">
        {displayPlaces.map((place, idx) => (
          <div key={idx} className="bg-gray-50 rounded-lg p-4 border-l-4 border-orange-300">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg font-semibold text-gray-800">{place.name}</h4>
              <span className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                {place.estimatedCost}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{place.category}</p>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>⏰ {place.bestTime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface FoodListProps {
  food: FoodSpot[];
  title: string;
  emoji: string;
}

export function FoodList({ food, title, emoji }: FoodListProps) {
  const displayFood = food.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-red-500 mb-8">
      <div className="flex items-center mb-6">
        <span className="text-3xl mr-3">{emoji}</span>
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
      </div>
      
      <div className="space-y-4">
        {displayFood.map((spot, idx) => (
          <div key={idx} className="bg-gray-50 rounded-lg p-4 border-l-4 border-red-300">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg font-semibold text-gray-800">{spot.name}</h4>
              <span className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full">
                {spot.priceRange}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{spot.cuisine}</p>
            <p className="text-sm font-medium text-gray-700">⭐ {spot.specialty}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
