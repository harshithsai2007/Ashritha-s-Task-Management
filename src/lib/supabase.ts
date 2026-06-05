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
export async function saveStateToCloud(state: CareerOSState, userId: string = "ashritha") {
  // Always save locally for double resilience
  const storageKey = userId === "harshith" ? "ai_os_v2_harshith" : "ai_os_state_ashritha";
  localStorage.setItem(storageKey, JSON.stringify(state));

  try {
    const res = await fetch("/api/state?user=" + userId, {
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
export async function loadStateFromCloud(defaultState: CareerOSState, userId: string = "ashritha"): Promise<CareerOSState> {
  const storageKey = userId === "harshith" ? "ai_os_v2_harshith" : "ai_os_state_ashritha";
  const localCached = localStorage.getItem(storageKey);
  let parsedLocal: CareerOSState | null = null;
  if (localCached) {
    try {
      parsedLocal = JSON.parse(localCached);
    } catch (_) {}
  }

  let cloudState: CareerOSState | null = null;
  try {
    const res = await fetch("/api/state?user=" + userId);
    if (res.ok) {
      const data = await res.json();
      if (data && data.state) {
        mongoConnected = true;
        let unwrapped = data.state;
        if (unwrapped.state) {
          unwrapped = unwrapped.state; // Safety fallback for nested state
        }
        cloudState = unwrapped as CareerOSState;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch state from MongoDB:", err);
  }

  // Auto-sync mechanism: if local device has more tasks than the cloud database
  // (which happens when we just migrated or were offline), push local data to cloud.
  const localTaskCount = parsedLocal ? (
    (parsedLocal.mlTopics?.length || 0) + 
    (parsedLocal.projectMilestones?.length || 0) + 
    (parsedLocal.aiToolsDays?.length || 0) + 
    (parsedLocal.dsaLogs?.length || 0) + 
    (parsedLocal.cloudTopics?.length || 0)
  ) : 0;

  const cloudTaskCount = cloudState ? (
    (cloudState.mlTopics?.length || 0) + 
    (cloudState.projectMilestones?.length || 0) + 
    (cloudState.aiToolsDays?.length || 0) + 
    (cloudState.dsaLogs?.length || 0) + 
    (cloudState.cloudTopics?.length || 0)
  ) : 0;

  if (parsedLocal && localTaskCount > cloudTaskCount) {
    console.log("Local state is richer than cloud. Pushing local to cloud to sync across devices...");
    saveStateToCloud(parsedLocal, userId).catch(console.error);
    return parsedLocal;
  }

  if (cloudState) {
    // Save the cloud state locally to keep things in sync
    const storageKey = userId === "harshith" ? "ai_os_v2_harshith" : "ai_os_state_ashritha";
    localStorage.setItem(storageKey, JSON.stringify(cloudState));
    return cloudState;
  }

  return parsedLocal || defaultState;
}
