import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToDb from "./utils/db";
import router from "./routes/index.routes";
import cron from 'node-cron';
import User from './models/user.model'
import { Competition } from "./models/competition.model";
import { Registration } from "./models/registration.model";
import { Queue } from 'bullmq';
import Redis from 'ioredis';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
connectToDb();

app.use("/", router);
app.get("/", (req, res) => {
  console.log("Hello World");
});

app.listen(3000, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});



const connection = new Redis();
const reminderQueue = new Queue('reminderQueue', { connection });


cron.schedule('* * * * *', async () => {
  console.log('[CRON] Checking competitions starting in next 24h');

  const now = new Date();
  const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  try {
    const competitions = await Competition.find({
      regDeadline: { $gt: now },
      startDate: { $gte: now, $lte: next24h },
    });

    for (const comp of competitions) {
      const registrations = await Registration.find({ competitionId: comp._id });

      for (const reg of registrations) {
        const user = await User.findById(reg.userId);
        if (!user) continue;


        await reminderQueue.add('sendReminder', {
          registrationId: reg._id,
          userId: user._id,
          competitionId: comp._id,
        });
      }
    }

    console.log(`[CRON] Enqueued reminders for ${competitions.length} competitions`);
  } catch (err) {
    console.error('[CRON] Error:', err);
  }
});
