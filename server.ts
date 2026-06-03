import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of MongoDB client
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://harshithsai597_db_user:22may2007@cluster0.sjf5030.mongodb.net/";
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

// Lazy initialization of Gemini client to prevent startup crash if API key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required but not set.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// GET user growth state from MongoDB
app.get("/api/state", async (req, res) => {
  try {
    const client = await getMongoClient();
    const db = client.db("growth_journal");
    const collection = db.collection("journey_state");
    const doc = await collection.findOne({ session_id: "ashritha_sole_warrior" });
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
    const client = await getMongoClient();
    const db = client.db("growth_journal");
    const collection = db.collection("journey_state");
    await collection.updateOne(
      { session_id: "ashritha_sole_warrior" },
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

// Gemini Chat Mentor Endpoint
app.post("/api/gemini/mentor", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      res.status(400).json({ error: "Message is required." });
      return;
    }

    const ai = getGeminiClient();
    
    // Construct structural system instructions for Ashritha's prompt
    const systemInstruction = 
      "You are Ashritha's Personal AI Mentor, an expert in Machine Learning, AI Project Development, " +
      "Data Structures & Algorithms (DSA), and Cloud Computing (AWS/Azure/GCP). You are helping her " +
      "transition into a world-class industry-ready AI Engineer.\n" +
      "Be encouraging, highly technical yet accessible, concise, structured, and motivational.\n" +
      "Focus your guidance on her five domains:\n" +
      "1. Machine Learning (Supervised, Unsupervised, Neural Networks, Deep Learning)\n" +
      "2. AI Project Milestone Development (breaking down concepts, architecture, feature engineering)\n" +
      "3. 30 Days AI Tools Challenge (helping her understand tool usecases for LinkedIn posts)\n" +
      "4. Daily DSA (explaining problem-solving patterns & platform challenges)\n" +
      "5. Cloud Foundations (AWS, Azure, GCP certification & hands-on maps)\n" +
      "Always address her as Ashritha, keep answers in beautiful Markdown, and be highly supportive!";

    // Call Gemini 3.5 Flash for prompt generation
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Assistant Error:", error);
    res.status(500).json({ 
      error: error.message || "An unexpected error occurred during AI generation.",
      needsApiKey: !process.env.GEMINI_API_KEY 
    });
  }
});

// Gemini LinkedIn Draft Generator Endpoint
app.post("/api/gemini/linkedin-draft", async (req, res) => {
  try {
    const { toolName, category, website, useCases, learnings } = req.body;
    if (!toolName) {
      res.status(400).json({ error: "Tool Name is required." });
      return;
    }

    const ai = getGeminiClient();

    const prompt = 
      `Write a highly engaging, professional, and viral-ready LinkedIn post draft for the tool "${toolName}" (Category: ${category}).\n` +
      `Product Website: ${website || "N/A"}\n` +
      `Core Use Cases: ${useCases || "N/A"}\n` +
      `Post-use Learnings / takeaways: ${learnings || "N/A"}\n\n` +
      `The post should be formatted for LinkedIn (short punchy paragraphs, bullet points, highly scannable, natural and authentic, no robotic AI jargon like 'delve', 'testament', or 'revolutionize'). Include relevant hashtags like #30DaysOfAITools #AI #MachineLearning #AIProject. Add an encouraging message for fellow builders. Start with a hook.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
      }
    });

    res.json({ draft: response.text });
  } catch (error: any) {
    console.error("Gemini LinkedIn Draft Error:", error);
    res.status(500).json({ 
      error: error.message || "An unexpected error occurred during LinkedIn post generation.",
      needsApiKey: !process.env.GEMINI_API_KEY 
    });
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
