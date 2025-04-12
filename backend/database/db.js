
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MON_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db("gotutordb"); // Change this to your actual database
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

export default connectDB;
