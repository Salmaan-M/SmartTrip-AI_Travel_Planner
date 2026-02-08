'use client';

import { useState } from 'react';
import TripForm from '@/components/TripForm';
import TravelPlanDisplay from '@/components/tambo/TravelPlanDisplay';
import { tripPlanSchema } from '@/lib/trip-schema';
import type { TripInput, TripPlan } from '@/types/trip';

export default function Home() {
  const [showForm, setShowForm] = useState(true);
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: TripInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/trip-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const body = (await res.json().catch(() => null)) as unknown;
      if (!res.ok) {
        const msg =
          body &&
          typeof body === 'object' &&
          'error' in body &&
          typeof (body as { error?: unknown }).error === 'string'
            ? (body as { error: string }).error
            : 'Failed to generate trip plan';
        throw new Error(msg);
      }

      const parsedPlan = tripPlanSchema.parse(body) as TripPlan;
      setPlan(parsedPlan);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
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
        {showForm && <TripForm onSubmit={handleSubmit} isLoading={isLoading} />}

        {/* Results */}
        {!showForm && (
          <div className="mt-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
                {error}
              </div>
            )}

            {plan && <TravelPlanDisplay {...plan} />}
          </div>
        )}

        {/* New Trip Button */}
        {!showForm && (plan || error) && (
          <button
            onClick={() => {
              setShowForm(true);
              setPlan(null);
              setError(null);
            }}
            className="mt-6 px-6 py-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow font-medium text-gray-700"
          >
            ← Plan Another Trip
          </button>
        )}
      </div>
    </main>
  );
}
