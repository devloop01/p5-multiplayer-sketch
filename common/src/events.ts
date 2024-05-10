interface Error {
  data?: null;
  error: string;
  errorDetails?: {
    message: string;
    path: Array<string | number>;
    type: string;
  }[];
}

interface Success<T> {
  data: T;
  error?: null;
}

export type Response<T = void> = Error | Success<T>;

export type Point = [number, number];
export type Line = Point[];

export type Player = {
  id: string;
  name: string;
  position: [number, number];
  color: string;
  isDrawing: boolean;
};

export type ServerEvents = {
  'player:created': (player: Player) => void;
  'player:updated': (player: Player) => void;
  'player:deleted': (playerId: Player['id']) => void;
  'player:list': (players: Player[]) => void;
  'player:startedDrawing': (playerId: Player['id']) => void;
  'player:stoppedDrawing': (playerId: Player['id']) => void;
};

export type ClientEvents = {
  'player:create': (payload: Omit<Player, 'id'>, callback: (res: Response<Player>) => void) => void;
  'player:update': (payload: Player, callback: (res: Response<Player>) => void) => void;
  'player:delete': (
    playedId: Player['id'],
    callback: (res: Response<Player['id']>) => void,
  ) => void;
  'player:startDrawing': (playerId: Player['id'], callback: (res: Response) => void) => void;
  'player:stopDrawing': (playerId: Player['id'], callback: (res: Response) => void) => void;
};
