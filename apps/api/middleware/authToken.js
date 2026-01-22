import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function verifyToken() {
    return (req, res, next) => {
        console.log(req)
        const token = req.header('x-auth-token');
        if(!token) return res.status(401).json({ error: "Access denied. No token provided."})
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded;
            next();
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

export { verifyToken };