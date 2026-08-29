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
    // select: false evita que la contraseña viaje por accidente en cualquier
    // consulta; hay que pedirla de forma explicita para el login.
    password: { type: String, required: true, select: false },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    birthDate: { type: Date, required: true },
    role: { type: String, enum: USER_ROLES, default: 'guest' },
    // Antes era un único ObjectId, lo que impedia guardar más de un favorito.
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
 * Único punto donde se hashea. Cualquier ruta que quiera cambiar la
 * contraseña debe asignarla al documento y llamar a save(); por eso el
 * servicio ya no usa findByIdAndUpdate, que se saltaba este hook y dejaba
 * la contraseña en texto plano.
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
