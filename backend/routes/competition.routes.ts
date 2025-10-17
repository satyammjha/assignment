import express from 'express';
import { registerForCompetition, createCompetition } from '../controller/competition.controller';

const router = express.Router();


router.post('/create', createCompetition);
router.post('/:id/register', registerForCompetition);

export default router;