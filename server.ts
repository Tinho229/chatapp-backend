import 'dotenv/config';
import app from './app';

const PORT = Number(process.env.PORT) || 6000;


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});