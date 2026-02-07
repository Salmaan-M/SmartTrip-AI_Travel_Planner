interface TipsCardProps {
  tips: string[];
}

export default function TipsCard({ tips }: TipsCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        💡 Travel Tips
      </h3>
      
      <ul className="space-y-3">
        {tips.map((tip, idx) => (
          <li key={idx} className="flex items-start">
            <span className="text-blue-500 mr-2 mt-1">✓</span>
            <span className="text-gray-700">{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}