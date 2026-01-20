import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { hashPassword } from "../middleware/authToken";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    id: {
        type: String,
        required: true,
        unique: true,
        default: () => new mongoose.Types.ObjectId().toString(),
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    birthDate: {
        required: true,
        type: Date,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    favouriteFlatsList: {
        type: [Object],
    }},
    { timestamps: true });
    
// MIDDLEWARE TO HASH PASSWORD BEFORE SAVING USER
User.schema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        alert("Password not modified")
        return next();
    }
    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error){
        return next(error);
    }
});

// METHOD TO GENERATE TOKEN
User.methods.generateAuthToken = function(){
    const token = jwt.sign(
        { _id: this._id, isAdmin: this.isAdmin }, 
        process.env.JWT_SECRET, 
        { expiresIn: '2h' } 
    );
    return token;
}

// METHOD TO COMPARE PASSWORDS
User.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;