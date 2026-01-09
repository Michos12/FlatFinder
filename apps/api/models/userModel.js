import mongoose from "mongoose";

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
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
    });
const User = mongoose.model("User", userSchema);

export default User;