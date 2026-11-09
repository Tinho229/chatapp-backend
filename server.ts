import 'dotenv/config';
import server from './app';

const PORT = Number(process.env.PORT) || 6000;


server.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});