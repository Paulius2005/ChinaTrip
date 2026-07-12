import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { initialItinerary, initialPacking, initialSurvival, initialExpenses } from "@/data/initialData";

const isSupabaseConfigured = () => {
  return !!supabase;
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tripId = searchParams.get("id") || "default";

  // Default template data if not found in database or DB not configured
  const defaultData = {
    itinerary: initialItinerary,
    packing: initialPacking,
    survival: initialSurvival,
    expenses: initialExpenses,
    budget: 3000 // default budget in EUR
  };

  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("trips")
        .select("data")
        .eq("id", tripId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data && data.data) {
        return NextResponse.json({
          success: true,
          synced: true,
          supabaseConfigured: true,
          data: data.data
        });
      }
    }

    return NextResponse.json({
      success: true,
      synced: true,
      supabaseConfigured: isSupabaseConfigured(),
      data: defaultData,
      notice: isSupabaseConfigured() ? "New trip initialized on Supabase" : "Running on local mock data"
    });
  } catch (error) {
    console.error("Supabase fetch error:", error);
    return NextResponse.json({
      success: false,
      synced: false,
      supabaseConfigured: isSupabaseConfigured(),
      error: error.message,
      data: defaultData
    });
  }
}

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const tripId = searchParams.get("id") || "default";

  try {
    const body = await request.json();

    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from("trips")
        .upsert({
          id: tripId,
          data: body,
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      return NextResponse.json({
        success: true,
        synced: true,
        supabaseConfigured: true
      });
    }

    return NextResponse.json({
      success: true,
      synced: true,
      supabaseConfigured: false,
      notice: "Supabase not configured. Saved locally."
    });
  } catch (error) {
    console.error("Supabase save error:", error);
    return NextResponse.json({
      success: false,
      synced: false,
      supabaseConfigured: isSupabaseConfigured(),
      error: error.message
    }, { status: 500 });
  }
}
