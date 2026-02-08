import { Place } from '@/types/trip';

interface PlacesCardProps {
  places?: Place[];
}

export default function PlacesCard({ places = [] }: PlacesCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        📍 Must-Visit Places
      </h3>
      
      <div className="space-y-4">
        {places.map((place, idx) => (
          <div key={idx} className="border-l-4 border-green-500 pl-4 py-2">
            <h4 className="font-semibold text-gray-800">{place.name}</h4>
            <div className="text-sm text-gray-600 mt-1 space-y-1">
              <p>🏛️ {place.category}</p>
              <p>⏰ Best time: {place.bestTime}</p>
              <p>💵 {place.estimatedCost}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}