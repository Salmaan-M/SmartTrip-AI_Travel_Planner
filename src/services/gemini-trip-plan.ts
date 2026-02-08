import { tripPlanSchema } from "@/lib/trip-schema";
import type { TripInput, TripPlan } from "@/types/trip";

function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  if (!trimmed.startsWith("```")) return trimmed;

  const firstNewline = trimmed.indexOf("\n");
  if (firstNewline === -1) return trimmed;

  const withoutStart = trimmed.slice(firstNewline + 1);
  const endFence = withoutStart.lastIndexOf("```");
  if (endFence === -1) return trimmed;

  return withoutStart.slice(0, endFence).trim();
}

function parseModelJson(text: string): unknown {
  const stripped = stripCodeFences(text);

  try {
    return JSON.parse(stripped);
  } catch {
    // Some models occasionally return leading/trailing text. Fall back to the
    // first JSON object-like section.
    const start = stripped.indexOf("{");
    const end = stripped.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      throw new Error("Failed to parse JSON from Gemini response");
    }

    try {
      return JSON.parse(stripped.slice(start, end + 1));
    } catch {
      throw new Error("Failed to parse JSON from Gemini response");
    }
  }
}

export async function generateTripPlanWithGemini(
  input: TripInput,
): Promise<TripPlan> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const prompt = [
    "You are a travel planning assistant.",
    "Return ONLY valid JSON (no markdown, no backticks) that matches this TypeScript shape:",
    "{ itinerary: { day: number, title: string, activities: { time: string, activity: string, duration: string, cost: string }[] }[], budget: { accommodation: number, food: number, transport: number, activities: number, total: number }, places: { name: string, category: string, bestTime: string, estimatedCost: string }[], food: { name: string, cuisine: string, specialty: string, priceRange: string }[], tips: string[] }",
    "Constraints:",
    `- itinerary length must equal ${input.days} and days must start at 1 and increment by 1`,
    "- keep costs realistic for the destination and the budget",
    "- budget.total should equal the sum of its parts",
    "Input:",
    JSON.stringify(input),
  ].join("\n");

  const url = new URL(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
  );
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(
      `Gemini API error (${res.status} ${res.statusText}): ${errText || "<no body>"}`,
    );
  }

  const data = (await res.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  const modelText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!modelText) {
    throw new Error("Gemini API returned an empty response");
  }

  const parsed = parseModelJson(modelText);
  return tripPlanSchema.parse(parsed) as TripPlan;
}
