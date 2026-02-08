
'use client';

import { useState } from 'react';
import { Send, Check } from 'lucide-react';
import { useTamboThreadInput } from '@tambo-ai/react';

const vibe_options = [
  {
    id: 'modern',
    label: '🏙️ Modern City',
    value: 'modern',
    description: 'Shibuya, Shinjuku, tech scene, nightlife',
  },
  {
    id: 'food',
    label: '🍱 Food-Heavy',
    value: 'food',
    description: 'Tsukiji, local eateries, food tours',
  },
  {
    id: 'temples',
    label: '🏯 Temples/Culture',
    value: 'temples',
    description: 'Asakusa, Senso-ji, traditional sites',
  },
  {
    id: 'anime',
    label: '🎮 Anime/Gaming',
    value: 'anime',
    description: 'Akihabara, anime museums, themed cafes',
  },
  {
    id: 'shopping',
    label: '🛍️ Shopping',
    value: 'shopping',
    description: 'Ginza, Harajuku, luxury brands',
  },
  {
    id: 'daytrip',
    label: '🚗 Day Trips',
    value: 'daytrip',
    description: 'Mt. Fuji, Nikko, Kamakura, Hakone',
  },
];

const hotel_options = [
  {
    id: 'budget',
    label: '💰 Budget - $40-60/night',
    value: 'budget',
    description: 'Hostels, budget hotels • Total: ~$1,200',
  },
  {
    id: 'midrange',
    label: '⭐ Midrange - $100-150/night',
    value: 'midrange',
    description: '3-4 star hotels, comfortable • Total: ~$2,000',
  },
  {
    id: 'nicer',
    label: '✨ Nicer - $200-300/night',
    value: 'nicer',
    description: '4-5 star luxury experience • Total: ~$3,000',
  },
];

interface PreferenceGathererProps {
  onPreferencesSubmit?: (prefs: { vibe: string; hotel: string }) => void;
}

export default function PreferenceGatherer({ onPreferencesSubmit }: PreferenceGathererProps) {
  const { setValue, submit, isPending } = useTamboThreadInput();
  const [destination, setDestination] = useState<string>('');
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [customBudget, setCustomBudget] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resolveBudgetNumber = () => {
    if (!selectedBudget) return null;
    if (selectedBudget === '300-500') return 400;
    if (selectedBudget === '500-800') return 650;
    if (selectedBudget === '800-1200') return 1000;
    if (selectedBudget === 'custom') {
      const n = Number(customBudget.replace(/[^0-9.]/g, ''));
      return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
    }
    return null;
  };

  const handleConfirm = async () => {
    const budgetNumber = resolveBudgetNumber();
    if (!destination.trim() || !selectedVibe || !selectedHotel || !budgetNumber) {
      alert('Please enter destination, select vibe, hotel level, and a valid budget');
      return;
    }

    setIsSubmitting(true);

    try {
      const message = `I want to travel to ${destination}. My preferences: I want a ${selectedVibe} vibe with ${selectedHotel} hotel level and a total budget of $${budgetNumber} for 3 days (excluding flights).`;

      // Submit the message to Tambo using thread input API
      setValue(message);
      await submit();

      if (onPreferencesSubmit) {
        onPreferencesSubmit({ vibe: selectedVibe, hotel: selectedHotel });
      }
    } catch (error) {
      console.error('Error submitting preferences:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🌍 Plan Your Perfect Trip
        </h2>
        <p className="text-gray-600">
          Tell us where you're going, your vibe, hotel style, and budget—we'll create a complete 3-day itinerary instantly
        </p>
      </div>

      {/* Destination Input */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <label className="block">
          <h3 className="text-xl font-bold text-gray-800 mb-4">✈️ Where are you going?</h3>
          <input
            type="text"
            placeholder="e.g., Paris, Tokyo, Barcelona, Rome, Bangkok..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg"
          />
        </label>
      </div>

      {/* Two Column Layout for Vibe & Hotel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vibe Selection */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 What's your vibe?</h3>
            <div className="space-y-3">
              {vibe_options.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedVibe === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className="flex items-center mt-1">
                    <input
                      type="radio"
                      name="vibe"
                      value={option.value}
                      checked={selectedVibe === option.value}
                      onChange={(e) => setSelectedVibe(e.target.value)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    {selectedVibe === option.value && (
                      <Check className="w-4 h-4 text-blue-500 ml-1" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-800">{option.label}</p>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Hotel Selection with Prices */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🏨 Hotel Level?</h3>
            <div className="space-y-3">
              {hotel_options.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedHotel === option.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300 bg-white'
                  }`}
                >
                  <div className="flex items-center mt-1">
                    <input
                      type="radio"
                      name="hotel"
                      value={option.value}
                      checked={selectedHotel === option.value}
                      onChange={(e) => setSelectedHotel(e.target.value)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    {selectedHotel === option.value && (
                      <Check className="w-4 h-4 text-green-500 ml-1" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-800">{option.label}</p>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Budget Selection */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">💵 Total budget for 3 days (USD, excluding flights)</h3>
            <div className="space-y-3">
              <label className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedBudget === '300-500' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 bg-white'}`}>
                <div className="flex items-center mt-1">
                  <input type="radio" name="budget" value="300-500" checked={selectedBudget === '300-500'} onChange={(e) => setSelectedBudget(e.target.value)} className="w-4 h-4 cursor-pointer" />
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-800">$300–$500</p>
                  <p className="text-sm text-gray-600">Very budget: convenience-store meals, free sights, minimal paid attractions</p>
                </div>
              </label>

              <label className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedBudget === '500-800' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 bg-white'}`}>
                <div className="flex items-center mt-1">
                  <input type="radio" name="budget" value="500-800" checked={selectedBudget === '500-800'} onChange={(e) => setSelectedBudget(e.target.value)} className="w-4 h-4 cursor-pointer" />
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-800">$500–$800</p>
                  <p className="text-sm text-gray-600">Budget-comfort: a few paid attractions, good food, extra neighborhood exploring</p>
                </div>
              </label>

              <label className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedBudget === '800-1200' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 bg-white'}`}>
                <div className="flex items-center mt-1">
                  <input type="radio" name="budget" value="800-1200" checked={selectedBudget === '800-1200'} onChange={(e) => setSelectedBudget(e.target.value)} className="w-4 h-4 cursor-pointer" />
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-800">$800–$1200</p>
                  <p className="text-sm text-gray-600">More breathing room: nicer meals, more activities, easy transit choices</p>
                </div>
              </label>

              <label className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedBudget === 'custom' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 bg-white'}`}>
                <div className="flex items-center mt-1">
                  <input type="radio" name="budget" value="custom" checked={selectedBudget === 'custom'} onChange={(e) => setSelectedBudget(e.target.value)} className="w-4 h-4 cursor-pointer" />
                </div>
                <div className="ml-3 w-full">
                  <p className="font-semibold text-gray-800">Custom amount</p>
                  <p className="text-sm text-gray-600 mb-2">Tell me a number (USD) and we'll use that everywhere needed.</p>
                  {selectedBudget === 'custom' && (
                    <input type="text" placeholder="$1000" value={customBudget} onChange={(e) => setCustomBudget(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2" />
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleConfirm}
          disabled={!selectedVibe || !selectedHotel || isSubmitting}
          className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg ${
            selectedVibe && selectedHotel && !isSubmitting
              ? 'bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white cursor-pointer hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Send className="w-5 h-5" />
          {isSubmitting ? 'Creating Your Plan...' : 'Generate My Itinerary'}
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-linear-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>✨ No Typing Needed!</strong> Just enter your destination, select your preferences above, and hit the button - 
          we'll instantly create your perfect customized 3-day itinerary.
        </p>
      </div>
    </div>
  );
}

