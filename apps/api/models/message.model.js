import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    content: {
        type: String, required: true
    },
    flatId: {
        type: Schema.Types.ObjectId, ref: "Flat", required: true
    },
    senderId: {
        type: Schema.Types.ObjectId, ref: "User", required: true
    }
},
    { timestamps: true }
)

export const Message = mongoose.model("Message", messageSchema);