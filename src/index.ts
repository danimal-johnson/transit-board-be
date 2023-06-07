// require('dotenv').config();
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';

const app: express.Application = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response): void => {
  res.send('<h1>I see a departure board in your future!<h1>');
});

app.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
});
