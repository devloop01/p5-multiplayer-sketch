import { io, Socket } from 'socket.io-client';
import { ClientEvents, ServerEvents } from 'common';

export const socket: Socket<ServerEvents, ClientEvents> = io('ws://localhost:3000', {});
