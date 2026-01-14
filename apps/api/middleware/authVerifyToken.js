import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        // Get authorization in header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized user" });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Verify token
        const secret = process.env["JWT_SECRET"];

        if (!secret) {
            return res.status(401).json({ message: "Invalid user" });
        }

        const decoded = jwt.verify(token, secret);

        // Set User info into req.user
        req.user = { id: decoded.id, email: decoded.email, isAdmin: decoded.isAdmin };

        return next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};