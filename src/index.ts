import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import publicRouter from './data/routers/publicRouter';

const server: express.Application = express();

// Middleware
server.use(express.json());
server.use(express.static(path.join(__dirname, 'public')));

// Routes

server.use('/api', publicRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
});
