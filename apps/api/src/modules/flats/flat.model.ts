import mongoose, { Schema, type HydratedDocument, type Model } from 'mongoose';

export interface FlatDoc {
  city: string;
  streetName: string;
  streetNumber: number;
  areaSize: number;
  hasAC: boolean;
  yearBuilt: number;
  rentPrice: number;
  dateAvailable: Date;
  description?: string;
  imageUrl?: string;
  ownerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type FlatDocument = HydratedDocument<FlatDoc>;

const flatSchema = new Schema<FlatDoc>(
  {
    // Field names now come from the shared contract (@flatfinder/types): the
    // backend used to say stName / stNum / size / hasAc / availDate while the
    // frontend said something else entirely.
    city: { type: String, required: true, trim: true, index: true },
    streetName: { type: String, required: true, trim: true },
    streetNumber: { type: Number, required: true, min: 0 },
    areaSize: { type: Number, required: true, min: 1 },
    hasAC: { type: Boolean, default: false },
    yearBuilt: { type: Number, required: true, min: 1800 },
    rentPrice: { type: Number, required: true, min: 0, index: true },
    dateAvailable: { type: Date, required: true },
    description: { type: String, trim: true, maxlength: 2000 },
    imageUrl: { type: String, trim: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
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

export const Flat: Model<FlatDoc> = mongoose.model<FlatDoc>('Flat', flatSchema);
