import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config({ path: ".env.local" });
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of MongoDB client
const MONGODB_URI = process.env.MONGODB_URI || "";
let mongoClient: MongoClient | null = null;

async function getMongoClient(): Promise<MongoClient> {
  if (!mongoClient) {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is required but not set.");
    }
    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    console.log("Connected successfully to MongoDB Cluster");
  }
  return mongoClient;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// GET user growth state from MongoDB
app.get("/api/state", async (req, res) => {
  try {
    const user = req.query.user === "harshith" ? "harshith" : "ashritha";
    const sessionId = `${user}_sole_warrior`;
    
    const client = await getMongoClient();
    const db = client.db("growth_journal");
    const collection = db.collection("journey_state");
    const doc = await collection.findOne({ session_id: sessionId });
    if (doc && doc.state) {
      res.json({ state: doc.state });
    } else {
      res.json({ state: null });
    }
  } catch (error: any) {
    console.error("Failed to load state from MongoDB:", error);
    res.status(500).json({ error: error.message || "Failed to load state from MongoDB." });
  }
});

// POST save user growth state to MongoDB
app.post("/api/state", async (req, res) => {
  try {
    const state = req.body;
    if (!state) {
      res.status(400).json({ error: "State body is required." });
      return;
    }
    const user = req.query.user === "harshith" ? "harshith" : "ashritha";
    const sessionId = `${user}_sole_warrior`;
    
    const client = await getMongoClient();
    const db = client.db("growth_journal");
    const collection = db.collection("journey_state");
    await collection.updateOne(
      { session_id: sessionId },
      { 
        $set: { 
          state: state,
          updated_at: new Date().toISOString()
        } 
      },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (error: any) {
    console.error("Failed to save state to MongoDB:", error);
    res.status(500).json({ error: error.message || "Failed to save state to MongoDB." });
  }
});

// Configure Vite middleware in development, or serve built assets in production
async function configureServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

configureServer().catch((err) => {
  console.error("Failed to start full-stack server:", err);
});
