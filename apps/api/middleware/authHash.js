import bcrypt from "bcryptjs";
import isModifiedValidator from "../validators/modifiedValidator";
import dotenv from "dotenv";

dotenv.config();

function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (err) {
        return null;
    }
}

export { verifyToken };