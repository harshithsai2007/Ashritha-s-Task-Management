const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

async function run() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db("growth_journal");
  const collection = db.collection("journey_state");

  await collection.deleteOne({ session_id: "harshith_sole_warrior" });
  console.log("Deleted harshith's bad state");
  process.exit(0);
}

run().catch(console.error);
