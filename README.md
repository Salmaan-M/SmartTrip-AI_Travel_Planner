# 🧳 SmartTrip AI – Instant Travel Itinerary Generator

**SmartTrip** is an AI-powered travel planning application that creates personalized 3-day itineraries for any destination in seconds. Tell it your destination, vibe (modern city, food-heavy, cultural, adventure, shopping, or side trips), hotel preference (budget, midrange, luxury), and total budget—and get a complete plan with day-by-day activities, restaurant recommendations, budget breakdowns, and a downloadable PDF.

Built with **Tambo AI** for generative UI, **Google Gemini 2.0-flash** for intelligent itinerary generation, **Next.js 15**, and **Tailwind CSS**, SmartTrip eliminates the back-and-forth of travel planning by generating full, detailed itineraries instantly. No follow-up questions. No endless options. Just your perfect trip, ready to download.

## Features

- 🎯 **Smart Preference Selection**: Radio buttons for destination, vibe, hotel level, and budget (preset or custom)
- 📅 **Complete Itineraries**: Day-by-day breakdown with times, neighborhoods, and specific attractions
- 💰 **Smart Budget Breakdown**: Realistic allocation for accommodation, food, transit, and activities
- 🍽️ **Restaurant Recommendations**: 3 specific must-try restaurants tailored to your vibe
- 🎭 **Curated Attractions**: 3 top places to visit based on your interests
- 💡 **Pro Tips**: Practical travel advice for your destination
- 📄 **PDF Download**: One-click export of your entire itinerary (optimized for 1-2 pages)
- ⚡ **Instant Generation**: No typing required—select preferences and get a full plan in seconds

## Tech Stack

- **Frontend**: Next.js 15.5.7 with TypeScript
- **AI Framework**: Tambo AI (generative UI components)
- **LLM**: Google Gemini 2.0-flash (with fallback mock data)
- **Styling**: Tailwind CSS with custom typography
- **PDF Export**: jsPDF + html2canvas
- **State Management**: React hooks + Tambo context

## Getting Started

1. Clone or create the project
2. Install dependencies: `npm install`
3. Add your API keys to `.env.local`:
   - `NEXT_PUBLIC_TAMBO_API_KEY`: Get from [Tambo Dashboard](https://tambo.co/dashboard)
   - `NEXT_PUBLIC_GEMINI_API_KEY`: Get from [Google AI Studio](https://aistudio.google.com/)
4. Run dev server: `npm run dev`
5. Open `http://localhost:3000` and start planning trips!

## How It Works

1. **Select Preferences**: Choose your destination, travel vibe, hotel level, and budget
2. **AI Generation**: Gemini creates a complete 3-day itinerary based on your preferences
3. **View Plan**: See the full itinerary with neighborhoods, activities, restaurants, budget breakdown, and tips
4. **Download PDF**: Export the plan as a compact, printer-friendly PDF

## How Tambo Powers SmartTrip

SmartTrip leverages **Tambo AI** for intelligent, generative UI that adapts to user needs:

### Custom Components
- **PreferenceGatherer**: A Tambo-controlled component that renders radio buttons and text inputs for destination, vibe, hotel level, and budget selection. When users click "Generate My Itinerary," it programmatically submits their preferences to the AI.
- **TravelPlanDisplay**: A dynamic component that renders the complete 3-day itinerary with 5 sections: day-by-day schedule, budget breakdown, places to visit, restaurants, and pro tips. The AI decides to show this component after preferences are received.
- **DataCard**: A multi-select component used elsewhere in the Tambo ecosystem for flexible option selection.

### Generative Workflow
1. User enters preferences via the PreferenceGatherer component
2. System prompt instructs Tambo to immediately render TravelPlanDisplay with a complete itinerary
3. Tambo's `generateTravelPlan` tool calls Google Gemini 2.0-flash with travel planning instructions
4. Gemini returns structured itinerary data that populates TravelPlanDisplay
5. Users download the rendered plan as a PDF without any follow-up questions

### System Prompt Control
The system prompt in `src/app/layout.tsx` guides Tambo to:
- Show PreferenceGatherer when the user mentions travel planning
- Never ask follow-up questions (fully constrained workflow)
- Immediately generate a TravelPlanDisplay with complete, destination/vibe-specific recommendations
- Include all 5 sections of content in structured format

### Tambo Hooks
- **useTamboThread**: Accesses the message thread to display chat history and rendered components
- **useTamboThreadInput**: Submits user preferences programmatically without manual typing
- **TamboProvider**: Wraps the entire app with components and tools registration

### Result
A seamless experience where users select preferences → AI generates complete itinerary → PDF downloads, all without typing or follow-up prompts. Tambo's generative components eliminate UI boilerplate and let the AI decide what to show and when.
