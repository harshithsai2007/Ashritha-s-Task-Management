const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

async function run() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db("growth_journal");
  const collection = db.collection("journey_state");

  const docs = await collection.find({}).toArray();
  for (const doc of docs) {
    if (doc.state && doc.state.state) {
      console.log(`Fixing double-nested state for ${doc.session_id}`);
      await collection.updateOne(
        { _id: doc._id },
        { $set: { state: doc.state.state } }
      );
    }
  }
  console.log("Done");
  process.exit(0);
}

run().catch(console.error);
