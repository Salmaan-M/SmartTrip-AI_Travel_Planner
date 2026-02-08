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
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
