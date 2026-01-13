import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    content: {
        type: String, required: true
    },
    flatId: {
        type: Schema.Types.ObjectId, ref: "Flat", required: true
    },
    senderId: {
        type: Schema.Types.ObjectId, ref: "User", required: true
    },
    createdAt: { 
        type: Date, required: true
    },
})

module.exports = mongoose.model("Message", messageSchema);