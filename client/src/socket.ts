import { io, Socket } from 'socket.io-client';
import { ClientEvents, ServerEvents } from 'common';

const URL = import.meta.env.VITE_SOCKET_SERVER_URL;

if (!URL) {
  throw new Error('VITE_SOCKET_SERVER_URL is not defined');
}

export const socket: Socket<ServerEvents, ClientEvents> = io(URL, {});
