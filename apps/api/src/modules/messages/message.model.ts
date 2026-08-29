import mongoose, { Schema, type HydratedDocument, type Model } from 'mongoose';

export interface MessageDoc {
  content: string;
  flatId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type MessageDocument = HydratedDocument<MessageDoc>;

const messageSchema = new Schema<MessageDoc>(
  {
    content: { type: String, required: true, trim: true, maxlength: 2000 },
    flatId: { type: Schema.Types.ObjectId, ref: 'Flat', required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(_doc, ret: Record<string, unknown>) {
        ret['id'] = ret['_id']?.toString();
        delete ret['_id'];
        return ret;
      },
    },
  },
);

// Both queries in this module filter by flat and sort by date.
messageSchema.index({ flatId: 1, createdAt: 1 });

export const Message: Model<MessageDoc> = mongoose.model<MessageDoc>('Message', messageSchema);
