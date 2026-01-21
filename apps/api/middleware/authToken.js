import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function verifyToken(requiredRole = 'admin') {
    return (req, res, next) => {
        console.log(req)
        const token = req.header('x-auth-token');
        if(!token) return res.status(401).json({ error: "Access denied. No token provided."})
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded;
            if(req.user.role == 'admin'){
                next()
            } else if(requiredRole == "owner"){
                if (req.params.id == req.user._id) next()
                else return res.status(403).json({ error: "Access denied. You can only modify your own account." }); 
            } else {
                return res.status(403).json({ error: "Access denied. Admins only." });
            }
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

export { verifyToken };