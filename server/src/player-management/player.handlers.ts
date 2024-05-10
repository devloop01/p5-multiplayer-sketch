import { Socket } from 'socket.io';
import { ClientEvents, Player, ServerEvents } from 'common';
import { PlayerRepository } from './player.repository';

export function createPlayerHandlers({ playerRepository }: { playerRepository: PlayerRepository }) {
  return {
    createPlayer: async function (
      ...[payload, callback]: Parameters<ClientEvents['player:create']>
    ) {
      // @ts-ignore
      const socket: Socket<ClientEvents, ServerEvents> = this;

      const newPlayer: Player = {
        id: socket.id,
        ...payload,
      };

      try {
        await playerRepository.save(newPlayer);
      } catch (error) {
        return callback({ error: 'Failed to create player' });
      }

      callback({ data: newPlayer });

      socket.broadcast.emit('player:created', newPlayer);

      socket.broadcast.emit('player:list', await playerRepository.findAll());
      socket.emit('player:list', await playerRepository.findAll());
    },

    updatePlayer: async function (
      ...[payload, callback]: Parameters<ClientEvents['player:update']>
    ) {
      // @ts-ignore
      const socket: Socket<ClientEvents, ServerEvents> = this;

      try {
        await playerRepository.update(payload);
      } catch (error) {
        return callback({ error: 'Failed to update player' });
      }

      callback({ data: payload });

      socket.broadcast.emit('player:updated', payload);
    },

    deletePlayer: async function (
      ...[payload, callback]: Parameters<ClientEvents['player:delete']>
    ) {
      // @ts-ignore
      const socket: Socket<ClientEvents, ServerEvents> = this;

      try {
        await playerRepository.deleteById(payload);
      } catch (error) {
        return callback({ error: 'Failed to delete player' });
      }

      callback({ data: payload });

      socket.broadcast.emit('player:deleted', payload);

      socket.broadcast.emit('player:list', await playerRepository.findAll());
      socket.emit('player:list', await playerRepository.findAll());
    },

    startDrawing: async function (
      ...[payload, callback]: Parameters<ClientEvents['player:startDrawing']>
    ) {
      // @ts-ignore
      const socket: Socket<ClientEvents, ServerEvents> = this;

      try {
        await playerRepository.startDrawing(payload);
      } catch (error) {
        return callback({ error: 'Failed to start drawing' });
      }

      callback({ data: undefined });

      socket.broadcast.emit('player:startedDrawing', payload);
    },

    stopDrawing: async function (
      ...[payload, callback]: Parameters<ClientEvents['player:startDrawing']>
    ) {
      // @ts-ignore
      const socket: Socket<ClientEvents, ServerEvents> = this;

      try {
        await playerRepository.stopDrawing(payload);
      } catch (error) {
        return callback({ error: 'Failed to stop drawing' });
      }

      callback({ data: undefined });

      socket.broadcast.emit('player:stoppedDrawing', payload);
    },
  };
}
