import { FoodSpot } from '@/types/trip';

interface FoodCardProps {
  food?: FoodSpot[];
}

export default function FoodCard({ food = [] }: FoodCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        🍽️ Food Recommendations
      </h3>
      
      <div className="space-y-4">
        {food.map((spot, idx) => (
          <div key={idx} className="bg-orange-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800">{spot.name}</h4>
            <div className="text-sm text-gray-600 mt-2 space-y-1">
              <p>🌍 {spot.cuisine}</p>
              <p>⭐ Try: {spot.specialty}</p>
              <p>💰 {spot.priceRange}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}