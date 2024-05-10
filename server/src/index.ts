import dotenv from 'dotenv';
import { createServer } from 'http';

dotenv.config();

import { createApplication } from './app';
import { InMemoryPlayerRepository } from './player-management/player.repository';

const PORT = process.env.PORT || 3000;
const ORIGIN = process.env.ORIGIN;

if (!ORIGIN) {
  throw new Error('ORIGIN is not defined');
}

const httpServer = createServer();

createApplication(
  httpServer,
  { playerRepository: new InMemoryPlayerRepository() },
  {
    cors: {
      origin: [ORIGIN],
    },
  },
);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
