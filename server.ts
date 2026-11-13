import 'dotenv/config';
import server from './app';
import './src/cron/cronJobs.job'
const PORT = Number(process.env.PORT) || 5000;


server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});