import { createClient } from "@supabase/supabase-js";
import { AdviceMessage, getRandomMockAdvice } from "./mockData";

// Environment variables
const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Clean the Supabase URL. The Supabase JS Client expects the project's base URL:
// "https://<project-id>.supabase.co" rather than the "/rest/v1/" endpoint.
// We strip '/rest/v1/' or '/rest/v1' from the end of the URL if it is present.
const cleanSupabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, "");

// Instantiate Supabase Client
export const supabase = createClient(cleanSupabaseUrl, supabaseAnonKey);

/**
 * Fetch a random message for a specific scenario from the live Supabase database.
 * If the read query returns nothing or fails, falls back gracefully to high-quality local mock data.
 */
export async function fetchRandomMessageForScenario(scenario: string): Promise<AdviceMessage> {
  if (!cleanSupabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials missing. Using mock fallback.");
    return getRandomMockAdvice(scenario);
  }

  try {
    // 1. Fetch matching rows from Supabase 'messages' table
    const { data, error } = await supabase
      .from("messages")
      .select("id, scenario, message, timestamp")
      .eq("scenario", scenario);

    if (error) {
      console.error("Supabase select error:", error.message);
      throw error;
    }

    if (!data || data.length === 0) {
      console.log(`No active entries in database for scenario "${scenario}". Serving mock seed.`);
      return getRandomMockAdvice(scenario);
    }

    // 2. Select a random row from the database result
    const randomIndex = Math.floor(Math.random() * data.length);
    const chosen = data[randomIndex];

    return {
      id: chosen.id,
      scenario: chosen.scenario,
      message: chosen.message,
      // Fallback in case table has 'created_at' or missing timestamp column
      timestamp: chosen.timestamp || (chosen as any).created_at || new Date().toISOString(),
    };
  } catch (err) {
    console.warn(`Database connection or read failed. Gracefully falling back to mock data.`, err);
    return getRandomMockAdvice(scenario);
  }
}

/**
 * Insert a new message into the live Supabase database messages table.
 * All actions conform to public anonymous insert RLS policies.
 */
export async function insertMessageToSupabase(scenario: string, messageText: string): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!cleanSupabaseUrl || !supabaseAnonKey) {
    return { success: false, error: "Supabase client not initialized: credentials missing." };
  }

  const clientTimestamp = new Date().toISOString();

  try {
    // Attempt inserting. We provide both 'timestamp' and 'created_at' to be resilient
    // to whatever schema is configured in the Supabase 'messages' table.
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          scenario: scenario,
          message: messageText,
          timestamp: clientTimestamp,
          created_at: clientTimestamp, // common Supabase default column name
        }
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Unexpected database write failure:", err);
    return { success: false, error: err.message || String(err) };
  }
}
