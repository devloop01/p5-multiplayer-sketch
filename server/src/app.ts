import { Server as HttpServer } from 'http';
import { Server, ServerOptions } from 'socket.io';
import { ClientEvents, ServerEvents } from 'common';
import { PlayerRepository } from './player-management/player.repository';
import { createPlayerHandlers } from './player-management/player.handlers';

export interface Components {
  playerRepository: PlayerRepository;
}

export function createApplication(
  httpServer: HttpServer,
  components: Components,
  serverOptions: Partial<ServerOptions> = {},
): Server<ClientEvents, ServerEvents> {
  const io = new Server<ClientEvents, ServerEvents>(httpServer, serverOptions);

  const { createPlayer, updatePlayer, deletePlayer, startDrawing, stopDrawing } =
    createPlayerHandlers(components);

  io.on('connection', (socket) => {
    console.log('New connection:', socket.id);
    console.log('Total connections:', io.engine.clientsCount);

    socket.on('player:create', createPlayer);
    socket.on('player:update', updatePlayer);
    socket.on('player:delete', deletePlayer);
    socket.on('player:startDrawing', startDrawing);
    socket.on('player:stopDrawing', stopDrawing);
  });

  return io;
}
