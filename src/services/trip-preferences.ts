/**
 * @file trip-preferences.ts
 * @description Service to gather and format trip preferences for DataCard display
 */

export interface TripPreferences {
  startPoint?: string;
  toyTrain?: string;
  interests?: string[];
  travelType?: 'solo' | 'friends' | 'family';
  budget?: string;
}

/**
 * Provides preference options for users to select from
 * This helps structure the selection flow for trip planning
 */
export function getTripPreferenceOptions() {
  return {
    travelType: [
      { id: 'solo', label: 'Solo Traveler', value: 'solo', description: 'Traveling alone' },
      { id: 'friends', label: 'Friends', value: 'friends', description: 'Traveling with friends' },
      { id: 'family', label: 'Family', value: 'family', description: 'Traveling with family' },
    ],
    budget: [
      { id: 'budget', label: 'Budget ($1,000-2,000)', value: 'budget', description: 'Economical travel' },
      { id: 'moderate', label: 'Moderate ($2,000-5,000)', value: 'moderate', description: 'Comfortable travel' },
      { id: 'luxury', label: 'Luxury ($5,000+)', value: 'luxury', description: 'Premium experience' },
    ],
    startPoint: [
      { id: 'bangalore', label: 'Bangalore', value: 'bangalore', description: 'Starting from Bangalore' },
      { id: 'coimbatore', label: 'Coimbatore', value: 'coimbatore', description: 'Starting from Coimbatore' },
      { id: 'mysuru', label: 'Mysuru', value: 'mysuru', description: 'Starting from Mysuru' },
      { id: 'chennai', label: 'Chennai', value: 'chennai', description: 'Starting from Chennai' },
      { id: 'other', label: 'Other', value: 'other', description: 'Different starting point' },
    ],
    toyTrain: [
      { id: 'yes', label: 'Yes', value: 'yes', description: 'Include toy train experience' },
      { id: 'no', label: 'No', value: 'no', description: 'Skip toy train' },
    ],
    interests: [
      { id: 'tea', label: 'Tea Estates', value: 'tea', description: 'Explore tea gardens and plantations' },
      { id: 'hikes', label: 'Hikes', value: 'hikes', description: 'Adventure hiking trails' },
      { id: 'waterfalls', label: 'Waterfalls', value: 'waterfalls', description: 'Scenic waterfalls' },
      { id: 'wildlife', label: 'Wildlife', value: 'wildlife', description: 'Wildlife and nature reserves' },
      { id: 'viewpoints', label: 'Viewpoints', value: 'viewpoints', description: 'Scenic viewpoints and vistas' },
      { id: 'cafes', label: 'Cafés & Shopping', value: 'cafes', description: 'Cafes, restaurants and shopping' },
    ],
  };
}

/**
 * Formats preferences for card display
 */
export function formatPreferencesForCards(category: string, options?: any[]) {
  const allOptions = getTripPreferenceOptions();
  const categoryOptions = (allOptions as any)[category] || [];
  
  return {
    title: getCategoryTitle(category),
    options: categoryOptions,
  };
}

function getCategoryTitle(category: string): string {
  const titles: Record<string, string> = {
    travelType: 'Who are you traveling with?',
    budget: 'What is your budget?',
    startPoint: 'Where do you want to start?',
    toyTrain: 'Do you want the toy train experience?',
    interests: 'What are your interests?',
  };
  return titles[category] || category;
}
