import { Player } from 'common';

enum Errors {
  ENTITY_NOT_FOUND = 'entity not found',
  INVALID_PAYLOAD = 'invalid payload',
}

abstract class CrudRepository<T, ID> {
  abstract findAll(): Promise<T[]>;
  abstract findById(id: ID): Promise<T>;
  abstract save(entity: T): Promise<void>;
  abstract update(entity: T): Promise<void>;
  abstract deleteById(id: ID): Promise<void>;
}

export abstract class PlayerRepository extends CrudRepository<Player, Player['id']> {
  abstract startDrawing(id: Player['id']): Promise<void>;
  abstract stopDrawing(id: Player['id']): Promise<void>;
}

export class InMemoryPlayerRepository extends PlayerRepository {
  private readonly players: Map<Player['id'], Player> = new Map();

  findAll() {
    const entities = Array.from(this.players.values());
    return Promise.resolve(entities);
  }

  findById(id: Player['id']) {
    if (this.players.has(id)) {
      return Promise.resolve(this.players.get(id)!);
    } else {
      return Promise.reject(Errors.ENTITY_NOT_FOUND);
    }
  }

  save(entity: Player) {
    this.players.set(entity.id, entity);
    return Promise.resolve();
  }

  update(entity: Player) {
    const player = this.players.get(entity.id);

    if (player) {
      this.players.set(entity.id, entity);
      return Promise.resolve();
    }

    return Promise.reject(Errors.ENTITY_NOT_FOUND);
  }

  deleteById(id: Player['id']) {
    const deleted = this.players.delete(id);
    if (deleted) {
      return Promise.resolve();
    } else {
      return Promise.reject(Errors.ENTITY_NOT_FOUND);
    }
  }

  startDrawing(id: Player['id']) {
    const player = this.players.get(id);

    if (player) {
      player.isDrawing = true;
      this.players.set(id, player);
      return Promise.resolve();
    }

    return Promise.reject(Errors.ENTITY_NOT_FOUND);
  }

  stopDrawing(id: Player['id']) {
    const player = this.players.get(id);

    if (player) {
      player.isDrawing = false;
      this.players.set(id, player);
      return Promise.resolve();
    }

    return Promise.reject(Errors.ENTITY_NOT_FOUND);
  }
}
