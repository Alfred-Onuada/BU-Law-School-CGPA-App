import express from 'express';
import apiRoutes from './routes/api.routes';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ['https://bulaw-gpa.web.app', 'http://localhost:4200'],
  })
);

async function main() {
  app.use('', apiRoutes);

  app.all('*', (_, res) => {
    res.status(404).json({ message: 'There is nothing here. 404 Not Found' });
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
