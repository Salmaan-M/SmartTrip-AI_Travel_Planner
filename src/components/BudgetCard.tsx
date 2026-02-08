import { Budget } from '@/types/trip';

interface BudgetCardProps {
  budget?: Budget;
}

export default function BudgetCard({ budget }: BudgetCardProps) {
  // Provide default values if budget is undefined
  const defaultBudget: Budget = {
    accommodation: 0,
    food: 0,
    transport: 0,
    activities: 0,
    total: 0,
  };

  const budgetData = budget || defaultBudget;

  const categories = [
    { name: 'Accommodation', amount: budgetData.accommodation, icon: '🏨' },
    { name: 'Food', amount: budgetData.food, icon: '🍽️' },
    { name: 'Transport', amount: budgetData.transport, icon: '🚗' },
    { name: 'Activities', amount: budgetData.activities, icon: '🎭' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        💰 Budget Breakdown
      </h3>
      
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-gray-700 font-medium">{cat.name}</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              ${cat.amount}
            </span>
          </div>
        ))}
        
        <div className="border-t-2 border-gray-200 pt-4 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-800">Total</span>
            <span className="text-2xl font-bold text-blue-600">
              ${budgetData.total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}