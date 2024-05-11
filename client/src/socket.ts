import { io, Socket } from 'socket.io-client';
import { ClientEvents, ServerEvents } from 'common';

const URL = import.meta.env.VITE_SOCKET_SERVER_URL;

if (!URL) {
  throw new Error('VITE_SOCKET_SERVER_URL is not defined');
}

// const protocol = window.location.protocol.includes('https') ? 'wss': 'ws'
// const ws = new WebSocket(`${protocol}://${location.host}`);

export const socket: Socket<ServerEvents, ClientEvents> = io(
  URL,
  // 'wss://distinguished-learning-production.up.railway.app',
);
