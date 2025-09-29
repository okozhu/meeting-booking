import { colUsers } from "../connect.js";

export async function listUsers(_req, res) {
    try {
        const users = await colUsers();
        const docs = await users
            .find({}, { projection: { password_hash: 0 } })
            .sort({ created_at: -1 })
            .toArray();

        const data = docs.map(u => ({
            id: u._id.toString(),
            email: u.email,
            name: u.name,
            created_at: u.created_at,
        }));

        res.json(data);
    } catch (e) {
        console.error("listUsers error:", e);
        res.status(500).json({ message: "Server error." });
    }
}
