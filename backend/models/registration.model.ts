import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistration extends Document {
  userId: mongoose.Types.ObjectId;
  competitionId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  competitionId: { type: Schema.Types.ObjectId, ref: 'Competition', required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Registration = mongoose.model<IRegistration>('Registration', RegistrationSchema);