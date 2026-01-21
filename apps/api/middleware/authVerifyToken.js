import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized user" });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const secret = process.env.SECRET_KEY || "secret";

        if (!secret) {
            return res.status(401).json({ message: "Invalid user" });
        }

        const decoded = jwt.verify(token, secret);

        req.user = { id: decoded._id, email: decoded.email, isAdmin: decoded.isAdmin };

        return next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};