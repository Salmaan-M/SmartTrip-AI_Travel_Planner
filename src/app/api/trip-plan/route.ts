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
          code: "INVALID_BODY",
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
      return NextResponse.json(
        {
          code: "CONFIG_ERROR",
          error: "Server missing GEMINI_API_KEY",
        },
        { status: 500 },
      );
    }

    if (err instanceof Error && err.message === "Gemini API request timed out") {
      return NextResponse.json(
        {
          code: "TIMEOUT",
          error: "Trip planning timed out. Please try again.",
        },
        { status: 504 },
      );
    }

    if (err instanceof Error && err.message.startsWith("Gemini API error (")) {
      return NextResponse.json(
        {
          code: "UPSTREAM_ERROR",
          error: "Trip planning service is unavailable. Please try again.",
        },
        { status: 502 },
      );
    }

    console.error("Trip plan API error", err);
    return NextResponse.json(
      { code: "INTERNAL_ERROR", error: "Failed to generate trip plan" },
      { status: 500 },
    );
  }
}
