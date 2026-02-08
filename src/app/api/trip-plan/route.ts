import { tripInputSchema } from "@/lib/trip-schema";
import { generateTripPlanWithGemini } from "@/services/gemini-trip-plan";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const json = (await req.json()) as unknown;
    const input = tripInputSchema.parse(json);

    const plan = await generateTripPlanWithGemini(input);
    return NextResponse.json(plan);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: err.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    if (err instanceof Error && err.message === "Missing GEMINI_API_KEY") {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    console.error("Trip plan API error", err);
    return NextResponse.json(
      { error: "Failed to generate trip plan" },
      { status: 500 },
    );
  }
}
