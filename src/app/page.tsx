'use client';

import { useState } from 'react';
import { useTamboThread, useTamboThreadInput } from '@tambo-ai/react';
import TripForm from '@/components/TripForm';
import { TripInput } from '@/types/trip';

export default function Home() {
  const { thread } = useTamboThread();
  const { value, setValue, submit, isPending } = useTamboThreadInput();
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = async (data: TripInput) => {
    const prompt = `Create a ${data.days}-day travel plan for ${data.destination} with a budget of $${data.budget} for ${data.travelType} travel. Use the TravelPlanDisplay component to show the complete itinerary, budget breakdown, must-visit places, food recommendations, and travel tips.`;
    
    // Set the value first, then submit
    setValue(prompt);
    await submit();
    setShowForm(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            SmartTrip AI
          </h1>
          <p className="text-xl text-gray-600">
            Your AI-powered travel companion ✈️
          </p>
        </div>

        {/* Form */}
        {showForm && <TripForm onSubmit={handleSubmit} isLoading={isPending} />}

        {/* Messages and Components */}
        <div className="mt-8 space-y-6">
          {thread.messages.map((message) => (
            <div key={message.id}>
              {/* Show text content */}
              {Array.isArray(message.content) &&
                message.content.map((part, i) =>
                  part.type === 'text' ? (
                    <div key={i} className="bg-white rounded-lg p-4 mb-4">
                      <p className="text-gray-800">{part.text}</p>
                    </div>
                  ) : null
                )}
              
              {/* Show rendered component */}
              {message.renderedComponent}
            </div>
          ))}
        </div>

        {/* New Trip Button */}
        {!showForm && thread.messages.length > 0 && (
          <button
            onClick={() => setShowForm(true)}
            className="mt-6 px-6 py-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow font-medium text-gray-700"
          >
            ← Plan Another Trip
          </button>
        )}
      </div>
    </main>
  );
}