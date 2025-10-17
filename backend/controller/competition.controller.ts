import type { Request, Response } from 'express';
import { Competition } from '../models/competition.model';
import { Registration } from '../models/registration.model';
import { Queue } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis();
const registrationQueue = new Queue('registrationQueue', { connection });

export const registerForCompetition = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const userId = (user as any)._id;
    const competitionId = req.params.id;
    const idempotencyKey = req.headers['idempotency-key'] as string;

    if (!idempotencyKey) return res.status(400).json({ error: 'Idempotency-Key required' });

    const lockKey = `lock:registration:${competitionId}:${userId}`;
    const lock = await connection.set(lockKey, 'locked', 'NX', 'PX', 5000);
    if (!lock) return res.status(429).json({ error: 'Try again' });

    try {
        const competition = await Competition.findById(competitionId);
        if (!competition) return res.status(404).json({ error: 'Competition not found' });
        if (competition.regDeadline < new Date()) return res.status(400).json({ error: 'Registration closed' });

        const existingRegistration = await Registration.findOne({ userId, competitionId });
        if (existingRegistration) return res.status(409).json({ error: 'Already registered' });

        if (competition.registeredCount >= competition.capacity) return res.status(409).json({ error: 'Competition full' });


        const registration = await Registration.create({ userId, competitionId });
        competition.registeredCount += 1;
        await competition.save();


        await registrationQueue.add('sendConfirmation', {
            registrationId: registration._id,
            userId,
            competitionId,
        });

        res.status(201).json({ registrationId: registration._id });
    } finally {
        await connection.del(lockKey);
    }
};

export const createCompetition = async (req: Request, res: Response) => {
    const user = req.user as any;
    if (!user || user.role !== 'organizer') {
        return res.status(403).json({ error: 'Only organizers can create competitions' });
    }

    const { title, description, tags, capacity, regDeadline } = req.body;

    if (!title || !description || !capacity || !regDeadline) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const competition = await Competition.create({
            title,
            description,
            tags,
            capacity,
            regDeadline: new Date(regDeadline),
            registeredCount: 0,
        });

        res.status(201).json({ competitionId: competition._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create competition' });
    }
};