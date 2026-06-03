import { CareerOSState } from "../types";

// MongoDB connectivity indicator (checks via API health)
export let mongoConnected = false;

// Check MongoDB connection status on init
(async () => {
  try {
    const res = await fetch("/api/health");
    if (res.ok) {
      mongoConnected = true;
    }
  } catch (_) {
    mongoConnected = false;
  }
})();

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
    } else {
      mongoConnected = true;
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
        mongoConnected = true;
        return data.state as CareerOSState;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch state from MongoDB, using local fallback state:", err);
  }

  return parsedLocal || defaultState;
}
