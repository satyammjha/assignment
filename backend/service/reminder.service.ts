import { Worker } from 'bullmq';
import User from '../models/user.model'
import { Competition } from "../models/competition.model";
import { Registration } from "../models/registration.model";
import { MailBox } from '../models/mailbox.models';
import Redis from 'ioredis';

const connection = new Redis();

const worker = new Worker(
    'reminderQueue',
    async job => {
        const { registrationId, userId, competitionId } = job.data;

        const user = await User.findById(userId);
        const competition = await Competition.findById(competitionId);
        if (!user || !competition) throw new Error('Invalid reminder job');

        await MailBox.create({
            userId,
            to: user.email,
            subject: `Reminder: ${competition.title} starts soon!`,
            body: `Hello ${user.name}, your competition "${competition.title}" is starting soon.`,
            sentAt: new Date(),
        });

        console.log(`Reminder sent to ${user.email}`);
    },
    { connection }
);

worker.on('failed', (job, err) => {
    console.error(`Reminder job failed: ${job.id}`, err);
});