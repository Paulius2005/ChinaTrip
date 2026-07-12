import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { initialItinerary, initialPacking, initialSurvival, initialExpenses } from "@/data/initialData";

const isKvConfigured = () => {
  return !!(process.env.KV_REST_API_URL || process.env.KV_URL);
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tripId = searchParams.get("id") || "default";

  try {
    if (isKvConfigured()) {
      const data = await kv.get(`trip:${tripId}`);
      if (data) {
        return NextResponse.json({
          success: true,
          synced: true,
          data
        });
      }
    }

    // Default template data if not found in database or DB not configured
    const defaultData = {
      itinerary: initialItinerary,
      packing: initialPacking,
      survival: initialSurvival,
      expenses: initialExpenses,
      budget: 3000 // default budget in EUR
    };

    return NextResponse.json({
      success: true,
      synced: isKvConfigured(),
      data: defaultData,
      notice: isKvConfigured() ? "New trip initialized" : "Running on local mock data"
    });
  } catch (error) {
    console.error("Database fetch error:", error);
    return NextResponse.json({
      success: false,
      synced: false,
      error: error.message,
      data: {
        itinerary: initialItinerary,
        packing: initialPacking,
        survival: initialSurvival,
        expenses: initialExpenses,
        budget: 3000
      }
    });
  }
}

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const tripId = searchParams.get("id") || "default";

  try {
    const body = await request.json();

    if (isKvConfigured()) {
      await kv.set(`trip:${tripId}`, body);
      return NextResponse.json({
        success: true,
        synced: true
      });
    }

    return NextResponse.json({
      success: true,
      synced: false,
      notice: "Database not configured. Saved locally."
    });
  } catch (error) {
    console.error("Database save error:", error);
    return NextResponse.json({
      success: false,
      synced: false,
      error: error.message
    }, { status: 500 });
  }
}
