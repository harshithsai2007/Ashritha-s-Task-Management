/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from "@supabase/supabase-js";
import { CareerOSState } from "../types";

// Read Supabase environment variables
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "";
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Persists the Career OS State to MongoDB (via Express backend) and local storage.
 */
export async function saveStateToCloud(state: CareerOSState) {
  // Always save locally for double resilience
  localStorage.setItem("ashritha_ai_os_state", JSON.stringify(state));

  try {
    const res = await fetch("/api/state", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    });
    if (!res.ok) {
      console.warn("MongoDB API state save received non-200 status:", res.status);
    }
  } catch (err) {
    console.warn("Could not save to MongoDB cloud:", err);
  }
}

/**
 * Fetches the user's state from MongoDB (via Express backend) or falls back to local storage.
 */
export async function loadStateFromCloud(defaultState: CareerOSState): Promise<CareerOSState> {
  const localCached = localStorage.getItem("ashritha_ai_os_state");
  let parsedLocal: CareerOSState | null = null;
  if (localCached) {
    try {
      parsedLocal = JSON.parse(localCached);
    } catch (_) {}
  }

  try {
    const res = await fetch("/api/state");
    if (res.ok) {
      const data = await res.json();
      if (data && data.state) {
        return data.state as CareerOSState;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch state from MongoDB, using local fallback state:", err);
  }

  return parsedLocal || defaultState;
}
