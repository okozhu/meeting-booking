import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URL;

const client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

let _db = null;

export async function connectDB() {
    if (_db) return _db;
    await client.connect();
    _db = client.db("meeting-booking");
    console.log("✅ Connected to MongoDB (meeting-booking)");

    await _db.collection("users").createIndex({ email: 1 }, { unique: true });
    await _db.collection("appointments").createIndex({ client_id: 1 });
    await _db.collection("appointments").createIndex({ business_id: 1 });
    await _db.collection("appointments").createIndex(
        { business_id: 1, starts_at: 1 },
        { unique: true, partialFilterExpression: { status: "BOOKED" } }
    );

    return _db;
}

export async function colUsers() {
    const db = await connectDB();
    return db.collection("users");
}
export async function colBusinesses() {
    const db = await connectDB();
    return db.collection("businesses");
}
export async function colAppointments() {
    const db = await connectDB();
    return db.collection("appointments");
}
