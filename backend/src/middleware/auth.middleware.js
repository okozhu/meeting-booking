export function requireAuth(req, res, next) {
    const h = req.headers.authorization || "";
    const token = h.startsWith("Bearer ") ? h.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Unauthorized." });

    if (token.includes("|")) {
        const [id, role] = token.split("|");
        if (!id || !role) return res.status(401).json({ message: "Unauthorized." });
        req.user = { id, role };
        return next();
    }
    return res.status(401).json({ message: "Unauthorized." });
}
