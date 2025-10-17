import mongoose, { Schema, Document } from 'mongoose';

export interface IMailBox extends Document {
    userId: mongoose.Types.ObjectId;
    to: string;
    subject: string;
    body: string;
    sentAt: Date;
}

const MailBoxSchema = new Schema<IMailBox>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
});

export const MailBox = mongoose.model<IMailBox>('MailBox', MailBoxSchema);