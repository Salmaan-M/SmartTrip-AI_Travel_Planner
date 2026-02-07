import { DayItinerary } from '@/types/trip';

interface ItineraryCardProps {
  itinerary: DayItinerary[];
}

export default function ItineraryCard({ itinerary }: ItineraryCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        📅 Day-by-Day Itinerary
      </h3>
      
      <div className="space-y-6">
        {itinerary.map((day) => (
          <div key={day.day} className="border-l-4 border-blue-500 pl-4">
            <h4 className="text-xl font-semibold text-gray-800 mb-3">
              {day.title}
            </h4>
            
            <div className="space-y-3">
              {day.activities.map((activity, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-blue-600">
                      {activity.time}
                    </span>
                    <span className="text-sm text-gray-500">
                      {activity.duration}
                    </span>
                  </div>
                  <p className="text-gray-800 font-medium">{activity.activity}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Cost: {activity.cost}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}