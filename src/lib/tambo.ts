/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import { Graph, graphSchema } from "@/components/tambo/graph";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";
import PreferenceGatherer from "@/components/PreferenceGatherer";
import {
  getCountryPopulations,
  getGlobalPopulationTrend,
} from "@/services/population-stats";
import { generateTravelPlanWithGemini } from "@/services/gemini-travel";
import { formatPreferencesForCards } from "@/services/trip-preferences";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

/**
 * tools
 *
 * This array contains all the Tambo tools that are registered for use within the application.
 * Each tool is defined with its name, description, and expected props. The tools
 * can be controlled by AI to dynamically fetch data based on user interactions.
 */

export const tools: TamboTool[] = [
  {
    name: "countryPopulation",
    description:
      "A tool to get population statistics by country with advanced filtering options",
    tool: getCountryPopulations,
    inputSchema: z.object({
      continent: z.string().optional(),
      sortBy: z.enum(["population", "growthRate"]).optional(),
      limit: z.number().optional(),
      order: z.enum(["asc", "desc"]).optional(),
    }),
    outputSchema: z.array(
      z.object({
        countryCode: z.string(),
        countryName: z.string(),
        continent: z.enum([
          "Asia",
          "Africa",
          "Europe",
          "North America",
          "South America",
          "Oceania",
        ]),
        population: z.number(),
        year: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  {
    name: "globalPopulation",
    description:
      "A tool to get global population trends with optional year range filtering",
    tool: getGlobalPopulationTrend,
    inputSchema: z.object({
      startYear: z.number().optional(),
      endYear: z.number().optional(),
    }),
    outputSchema: z.array(
      z.object({
        year: z.number(),
        population: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  {
    name: "generateTravelPlan",
    description:
      "Generate a comprehensive, real travel plan for a destination using Gemini AI. Provides day-by-day itinerary, budget breakdown, must-visit places, food recommendations, and travel tips.",
    tool: generateTravelPlanWithGemini,
    inputSchema: z.object({
      destination: z.string().describe("City and/or country name (e.g., 'Paris, France')"),
      days: z.number().describe("Number of days for the trip (e.g., 3, 5, 7)"),
      budget: z.number().describe("Total budget available in USD"),
      travelType: z
        .enum(["solo", "friends", "family"])
        .describe("Type of travel: solo traveler, group of friends, or family with kids"),
    }),
    outputSchema: z.object({
      itinerary: z.array(
        z.object({
          day: z.number(),
          title: z.string(),
          activities: z.array(
            z.object({
              time: z.string(),
              activity: z.string(),
              duration: z.string(),
              cost: z.string(),
            }),
          ),
        }),
      ),
      budget: z.object({
        accommodation: z.number(),
        food: z.number(),
        transport: z.number(),
        activities: z.number(),
        total: z.number(),
      }),
      places: z.array(
        z.object({
          name: z.string(),
          category: z.string(),
          bestTime: z.string(),
          estimatedCost: z.string(),
        }),
      ),
      food: z.array(
        z.object({
          name: z.string(),
          cuisine: z.string(),
          specialty: z.string(),
          priceRange: z.string(),
        }),
      ),
      tips: z.array(z.string()),
    }),
  },
  {
    name: "getTripPreferences",
    description:
      "Get trip preference options for users to select from (travel type, budget, interests, start point, toy train preference). Use this to gather user preferences in a structured way.",
    tool: async (category: string) => {
      return formatPreferencesForCards(category);
    },
    inputSchema: z.object({
      category: z.enum(['travelType', 'budget', 'startPoint', 'toyTrain', 'interests']).describe("Category of preferences to retrieve")
    }),
    outputSchema: z.object({
      title: z.string(),
      options: z.array(z.object({
        id: z.string(),
        label: z.string(),
        value: z.string(),
        description: z.string().optional(),
      })),
    }),
  },
];

/**
 * components
 *
 * This array contains all the Tambo components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
import TravelPlanDisplay from '@/components/tambo/TravelPlanDisplay';

/**
 * Core components array - consolidated registration for all Tambo components
 * 
 * This array is passed to TamboProvider and defines all components that Tambo
 * can dynamically select and render based on user messages.
 * 
 * See: https://docs.tambo.co/guides/enable-generative-ui/register-components
 */
export const components: TamboComponent[] = [
  {
    name: "PreferenceGatherer",
    description:
      "A component that displays preference selection cards for travel planning. Shows options for travel vibe (modern, temples, food-heavy, anime, shopping, day trips) and hotel level (budget, midrange, nicer). Use this at the start of a trip planning conversation to gather user preferences.",
    component: PreferenceGatherer,
    propsSchema: z.object({}).optional(),
  },
  {
    name: "Graph",
    description:
      "A component that renders various types of charts (bar, line, pie) using Recharts. Supports customizable data visualization with labels, datasets, and styling options.",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "DataCard",
    description:
      "A component that displays options as interactive, clickable cards for users to select from. Use this WHENEVER presenting choices or preferences to select (e.g., travel type options, budget ranges, interest categories, start points, yes/no choices). Always use this instead of listing options as text.",
    component: DataCard,
    propsSchema: dataCardSchema,
  },
  {
    name: 'TravelPlanDisplay',
    description: 'Creates a comprehensive travel itinerary dashboard showing day-by-day activities, budget breakdown, must-visit places, food recommendations, and travel tips. Use this when presenting a complete travel plan in response to a trip planning request.',
    component: TravelPlanDisplay,
    propsSchema: z.object({
      itinerary: z.array(
        z.object({
          day: z.number().describe("Day number in the itinerary (1, 2, 3, etc.)"),
          title: z.string().describe("Title for the day's activities (e.g., 'Arrival & City Exploration')"),
          activities: z.array(
            z.object({
              time: z.string().describe("Time of activity in HH:MM format (e.g., '09:00')"),
              activity: z.string().describe("Description of the activity"),
              duration: z.string().describe("Duration like '2 hours' or '3 hours'"),
              cost: z.string().describe("Estimated cost with currency symbol (e.g., '$25')"),
            })
          ).describe("Array of planned activities for this day"),
        })
      ).optional().describe("Daily itinerary with scheduled activities. May be omitted if not applicable."),
      budget: z.object({
        accommodation: z.number().describe("Budget allocated for accommodations in dollars"),
        food: z.number().describe("Budget allocated for food and dining in dollars"),
        transport: z.number().describe("Budget allocated for transportation in dollars"),
        activities: z.number().describe("Budget allocated for activities and attractions in dollars"),
        total: z.number().describe("Total trip budget in dollars"),
      }).optional().describe("Budget breakdown by category. May be omitted if not discussing costs."),
      places: z.array(
        z.object({
          name: z.string().describe("Name of the attraction or place"),
          category: z.string().describe("Type of place (e.g., 'Historical Site', 'Museum', 'Restaurant')"),
          bestTime: z.string().describe("Best time to visit (e.g., 'early morning', 'afternoon')"),
          estimatedCost: z.string().describe("Estimated cost with currency symbol"),
        })
      ).optional().describe("Must-visit places and attractions. May be omitted if not available."),
      food: z.array(
        z.object({
          name: z.string().describe("Name of the restaurant or food establishment"),
          cuisine: z.string().describe("Type of cuisine (e.g., 'Italian', 'Thai', 'Local')"),
          specialty: z.string().describe("Signature dish or specialty to try"),
          priceRange: z.string().describe("Price range indicator (e.g., '$', '$$', '$$$')"),
        })
      ).optional().describe("Food recommendations and dining options. May be omitted if not relevant."),
      tips: z.array(z.string().describe("Practical travel tip or recommendation")).optional().describe("Travel tips and useful advice. May be omitted if not provided."),
    }).describe("Complete travel plan with itinerary, budget, places, food, and tips"),
  },
];
