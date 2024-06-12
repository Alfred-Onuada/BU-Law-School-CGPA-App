import express from 'express';
import apiRoutes from './routes/api.routes';
import cors from 'cors';
import path from 'node:path';

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(
  cors({
    origin: ['https://bulaw-gpa.web.app', 'http://localhost:4200'],
  })
);

async function main() {
  app.use('/api', apiRoutes);

  app.get('', (_, res) => {
    res.sendFile('public/index.html', { root: __dirname });
  });
  
  app.all('*', (_, res) => {
    res.sendFile('public/index.html', { root: __dirname });
  });

  app.listen(process.env.PORT || 3453, () => {
    console.log('App is live');
  });
}

main()
  .then(() => {
    console.info('Server started');
  })
  .catch((error) => {
    console.error('Error starting server: ', error);
  });
