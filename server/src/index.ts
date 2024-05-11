import dotenv from 'dotenv';
import { createServer } from 'http';

dotenv.config();

import { createApplication } from './app';
import { InMemoryPlayerRepository } from './player-management/player.repository';

const HOST = '0.0.0.0';
const PORT = parseInt(process.env.PORT || '3000');
const ORIGIN = process.env.ORIGIN;
const DEV = process.env.NODE_ENV === 'development';

const httpServer = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

const server = httpServer.listen(PORT, HOST, undefined, () => {
  console.log(`Server is running on port ${HOST}:${PORT}`);
});

createApplication(
  server,
  { playerRepository: new InMemoryPlayerRepository() },
  {
    cors: {
      origin: DEV ? '*' : ORIGIN,
    },
  },
);
