import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/user.model'
import { Competition } from "./models/competition.model";

const MONGO_URI = process.env.MONGO_URI

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');


        await User.deleteMany({});
        await Competition.deleteMany({});

        const organizerPassword = await bcrypt.hash('password123', 10);
        const organizers = await User.create([
            { name: 'Organizer One', email: 'org1@example.com', password: organizerPassword, role: 'organizer' },
            { name: 'Organizer Two', email: 'org2@example.com', password: organizerPassword, role: 'organizer' },
        ]);

        console.log('Created 2 organizers');


        const participantPassword = await bcrypt.hash('password123', 10);
        const participants = await User.create([
            { name: 'Participant One', email: 'user1@example.com', password: participantPassword, role: 'participant' },
            { name: 'Participant Two', email: 'user2@example.com', password: participantPassword, role: 'participant' },
            { name: 'Participant Three', email: 'user3@example.com', password: participantPassword, role: 'participant' },
            { name: 'Participant Four', email: 'user4@example.com', password: participantPassword, role: 'participant' },
            { name: 'Participant Five', email: 'user5@example.com', password: participantPassword, role: 'participant' },
        ]);

        console.log('Created 5 participants');


        const now = new Date();
        const competitions = await Competition.create([
            {
                title: 'Competition 1',
                description: 'First competition',
                capacity: 10,
                regDeadline: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
                startDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
            },
            {
                title: 'Competition 2',
                description: 'Second competition',
                capacity: 8,
                regDeadline: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
                startDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
            },
            {
                title: 'Competition 3',
                description: 'Third competition',
                capacity: 12,
                regDeadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
                startDate: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
            },
            {
                title: 'Competition 4',
                description: 'Fourth competition',
                capacity: 15,
                regDeadline: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
                startDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
            },
            {
                title: 'Competition 5',
                description: 'Fifth competition',
                capacity: 20,
                regDeadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
                startDate: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
            },
        ]);

        console.log('Created 5 competitions');

        console.log('Seeding completed!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();