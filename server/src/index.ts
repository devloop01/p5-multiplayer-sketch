import dotenv from 'dotenv';
import { createServer } from 'http';

dotenv.config();

import { createApplication } from './app';
import { InMemoryPlayerRepository } from './player-management/player.repository';

const HOST = '0.0.0.0';
const PORT = 3000;
const ORIGIN = process.env.ORIGIN;

if (!ORIGIN) {
  throw new Error('ORIGIN is not defined');
}

const httpServer = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

createApplication(
  httpServer,
  { playerRepository: new InMemoryPlayerRepository() },
  {
    cors: {
      origin: [ORIGIN],
    },
  },
);

httpServer.listen(PORT, HOST, undefined, () => {
  console.log(`Server is running on port ${HOST}:${PORT}`);
});
