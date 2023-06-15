import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import publicRouter from './data/routers/publicRouter';

const server: express.Application = express();

// Middleware
server.use(express.json());

server.get('/', (req: Request, res: Response): void => {
  res.send(`<h1>I see a departure board in your future!<h1>\
  <h2>Try /api/routes to see a list of bus routes</h2>\
  <ul>\
  <li><a href="https://github.com/danimal-johnson/transit-board-be">Visit the full project on GitHub</a></li>\
  <li><a href="https://github.com/danimal-johnson/transit-board-be/blob/main/docs/endpoints.md">API Documentation (markdown)</a></li>\
  </ul>\
  `);
});

// Routes

server.use('/api', publicRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
});
