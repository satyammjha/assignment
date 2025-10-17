import mongoose, { Schema, Document } from 'mongoose';

export interface ICompetition extends Document {
  title: string;
  description: string;
  tags?: string[];
  capacity: number;
  regDeadline: Date;
  registeredCount: number;
}

const CompetitionSchema = new Schema<ICompetition>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String],
  capacity: { type: Number, required: true },
  regDeadline: { type: Date, required: true },
  registeredCount: { type: Number, default: 0 },
});

export const Competition = mongoose.model<ICompetition>('Competition', CompetitionSchema);