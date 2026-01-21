import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema(
  { 
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flat",
    }},
    { timestamps: true }
);
    
// METHOD TO GENERATE TOKEN
userSchema.method('generateAuthToken', function(){
    const token = jwt.sign(
        { _id: this._id, isAdmin: this.isAdmin }, 
        process.env.SECRET_KEY, 
        { expiresIn: '2h' } 
    );
    return token;
});

// METHOD TO COMPARE PASSWORDS
userSchema.method('comparePassword', async function(password){
    return await bcrypt.compare(password, this.password);
});

// MIDDLEWARE TO HASH PASSWORD BEFORE SAVING USER
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return console.error("Password not modified");
    }
    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error){
        return error.message;
    }
});

const User = mongoose.model("User", userSchema);

export default User;