import { z } from "zod";

export const tripInputSchema = z.object({
  destination: z.string().min(1),
  days: z.number().int().min(1).max(30),
  budget: z.number().int().min(0),
  travelType: z.enum(["solo", "friends", "family"]),
});

export const tripPlanSchema = z.object({
  itinerary: z.array(
    z.object({
      day: z.number().int().min(1),
      title: z.string().min(1),
      activities: z.array(
        z.object({
          time: z.string().min(1),
          activity: z.string().min(1),
          duration: z.string().min(1),
          cost: z.string().min(1),
        }),
      ),
    }),
  ),
  budget: z.object({
    accommodation: z.number().nonnegative(),
    food: z.number().nonnegative(),
    transport: z.number().nonnegative(),
    activities: z.number().nonnegative(),
    total: z.number().nonnegative(),
  }),
  places: z.array(
    z.object({
      name: z.string().min(1),
      category: z.string().min(1),
      bestTime: z.string().min(1),
      estimatedCost: z.string().min(1),
    }),
  ),
  food: z.array(
    z.object({
      name: z.string().min(1),
      cuisine: z.string().min(1),
      specialty: z.string().min(1),
      priceRange: z.string().min(1),
    }),
  ),
  tips: z.array(z.string().min(1)),
});

export type TripInputSchema = z.infer<typeof tripInputSchema>;
export type TripPlanSchema = z.infer<typeof tripPlanSchema>;
