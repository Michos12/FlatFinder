import mongoose, { Schema } from "mongoose";

const flatSchema = new Schema({
    city: {
        type: String, required: true
    },
    stName: {
        type: String, required: true
    },
    stNum: {
        type: Number, required: true, min: 0
    },
    size: {
        type: Number, required: true, min: 0
    },
    hasAc: {
        type: Boolean, default: false
    },
    year: {
        type: Number, required: true, min: 1800
    },
    price: {
        type: Number, required: true, min: 0
    },
    availDate: {
        type: Date, required: true
    },
    ownerId: {
        type: Schema.Types.ObjectId, ref: "User", required: true
    }
},
    { timestamps: true }
)

export const Flat = mongoose.model("Flat", flatSchema);