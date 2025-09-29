import {colBusinesses} from "../connect.js";

export async function listBusiness(_req, res) {
    try {
        const businesses = await colBusinesses();

        const result = await businesses.find().toArray();

        res.json(result);
    } catch (e) {
        console.error("listBusiness error:", e);
        res.status(500).json({ message: "Server error." });
    }
}
