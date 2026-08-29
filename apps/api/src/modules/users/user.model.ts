import mongoose, { Schema, type HydratedDocument, type Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { USER_ROLES, type UserRole } from '@flatfinder/types';

const SALT_ROUNDS = 12;

export interface UserDoc {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  role: UserRole;
  avatarUrl?: string;
  favoriteFlatIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

interface UserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<UserDoc, UserMethods>;
type UserModel = Model<UserDoc, object, UserMethods>;

const userSchema = new Schema<UserDoc, UserModel, UserMethods>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    // select: false keeps the password from leaking into arbitrary queries;
    // login has to ask for it explicitly.
    password: { type: String, required: true, select: false },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    birthDate: { type: Date, required: true },
    role: { type: String, enum: USER_ROLES, default: 'guest' },
    // Stored as a URL. When file uploads land, the backend will write the
    // stored file's URL here and the shape of this field will not change.
    avatarUrl: { type: String, trim: true },
    // This used to be a single ObjectId, so only one favourite could be saved.
    favoriteFlatIds: [{ type: Schema.Types.ObjectId, ref: 'Flat' }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(_doc, ret: Record<string, unknown>) {
        ret['id'] = ret['_id']?.toString();
        delete ret['_id'];
        delete ret['password'];
        return ret;
      },
    },
  },
);

/**
 * The one place hashing happens. Any route that changes a password must assign
 * it to the document and call save(); that is why the service no longer uses
 * findByIdAndUpdate, which skipped this hook and stored the password in clear.
 */
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
});

userSchema.method('comparePassword', function comparePassword(candidate: string) {
  return bcrypt.compare(candidate, this.password);
});

export const User = mongoose.model<UserDoc, UserModel>('User', userSchema);
