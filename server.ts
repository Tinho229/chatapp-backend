import 'dotenv/config';
import server from './app';
import { startDailyQuestionJob } from './src/controllers/cron/cronJobs.job';

const PORT = Number(process.env.PORT) || 5000;

server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  startDailyQuestionJob();
});