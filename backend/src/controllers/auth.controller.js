import bcrypt from "bcrypt";
import { colBusinesses, colUsers } from '../connect.js'

const BUSINESS_ROLE = "BUSINESS"
const CLIENT_ROLE = "CLIENT"

export async function register(req, res) {
    try {
        const { email, password, name, role } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Please fill in all required fields." });

        const entity = role === BUSINESS_ROLE ? await colBusinesses() : await colUsers();

        const exists = await entity.findOne({ email });

        if (exists) return res.status(409).json({ message: "Email already taken." });

        const password_hash = await bcrypt.hash(password, 10);

        const { insertedId } = await entity.insertOne({ email, password_hash, name: name || null, role, created_at: new Date() });

        res.json({ token: `${insertedId.toString()}|${role}` });
    } catch (e) {
        res.status(500).json({ message: "Failed to register." });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const businesses = await colBusinesses();
        const clients = await colUsers();

        const business = await businesses.findOne({ email });
        const client = await clients.findOne({ email });

        const user = business ? business : client;
        const role = business ? BUSINESS_ROLE : CLIENT_ROLE;

        if (!user) return res.status(401).json({ message: "Invalid email or password." });

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) return res.status(401).json({ message: "Invalid email or password." });

        res.status(200).json({ token: `${user._id.toString()}|${role}` });
    } catch {
        res.status(500).json({ message: "Login failed." });
    }
}
