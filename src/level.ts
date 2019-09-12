import { Items, Levels, Monsters, Settings, Colors, getPossibleMonsters } from './datafiles'
import { dbg, msg } from './message'

import { Game } from './game'
import { Item } from './item'
import { Monster } from './monster'
import { RNG } from './dun'
import { TileMap, Tile } from './map'
import { Actor, ActorTemplate } from './actor'

export interface ILevel {
  domain: string
  levelID: number
}

export type Staircase = ">" | "<";

/**
 * A level is any area separated from the rest of the world by a
 * staircase, portal or other gateway.
 */
export class Level implements ILevel {
  public levelID: number;
  public domain: string;
  public map: TileMap;
  private monsters: Actor[];
  private items: Item[] = [];
  private game: Game;

  constructor(level: ILevel) {
    this.map = new TileMap(Settings.mapW, Settings.mapH);
    this.levelID = level.levelID;
    this.domain = level.domain;
    this.monsters = [];

    this.map.generate();
    this.generateActors(this.map);
    this.game = Game.getSingleton();
    this.draw();
  }

  public getItems() {
    return this.items;
  }

  public getMonsters() {
    return this.monsters;
  }

  public getFreeCells() {
    return this.map.getFreeCells()
  }

  public createBeing(what: any, freeCells: Tile[], spec: Partial<ActorTemplate>, activate = false) {
    let index = Math.floor(RNG.getUniform() * freeCells.length);
    let cell = freeCells[index];
    spec.x = cell.getPos().x
    spec.y = cell.getPos().y
    let actor = new what(spec)
    if (activate) {
      this.game.scheduler.add(actor, true)
    }
    return actor;
  }

  /**
   * Put random monsters on map. Only monsters, items that have races that have
   * this dungeon as possible domain range will be generated.
   * @param map
   */
  public generateActors(map: TileMap) {
    let freeCells = map.getFreeCells()

    const possibleMonsters = getPossibleMonsters(this.levelID);

    let possibleItems = Items.filter(item => item.domains.indexOf(this.levelID) >= 0);

    possibleMonsters.forEach(spec => {
      let n = RNG.getUniformInt(0, 30);
      for (let i = 0; i < n; i++) {
        this.monsters.push(this.createBeing(Monster, freeCells, spec));
      }
    })

    for (const spec of possibleItems) {
      let n = RNG.getUniformInt(0, 5)
      for (let i = 0; i < n; i++) {
        this.items.push(this.createBeing(Item, freeCells, spec));
      }
    }

    if (this.levelID !== Settings.game.winLevel) {
      map.createStaircase(this.getFreeCells(), '<', Colors.fire);
      map.createStaircase(this.getFreeCells(), '>', Colors.ice);
      map.createStaircase(this.getFreeCells(), '>', Colors.chaos);
      map.createStaircase(this.getFreeCells(), '>', Colors.magic);
      map.createStaircase(this.getFreeCells(), '<', Colors.orange);
    }
  }

  public draw() {
    this.map.draw();
    const exploredActors = [...this.monsters, ...this.items].filter(x => {
      const pos = x.getPos();
      if (!pos) {
        return false;
      }

      let tile = this.map.getTile(pos);
      return tile && tile.isExplored();
    })

    for (const actor of exploredActors) {
      actor.draw();
    }

    if (this.game !== null && this.game.player !== null) {
      this.game.player.draw();
    }
  }

  public getActorAt(tl: Tile) {
    if (!tl) {
      return null;
    }

    let monster = this.monsters.find(mon => {
      const monsterPosition = mon.getPos();
      if (!monsterPosition) {
        return false;
      }
      return monsterPosition.x === tl.getPos().x && monsterPosition.y === tl.getPos().y
    }
    );

    return monster;
  }

  public getNextLevel(staircase: Staircase) {
    const currentLevel = Levels.find(l => l.levelID === this.levelID);

    if (!currentLevel) {
      dbg(`Error: Level ${this.levelID} doesn't exist`);
      return;
    }
    const nextLevelNumber = staircase === '>' ? currentLevel.levelID + 1 : currentLevel.levelID - 1;

    if (nextLevelNumber === Settings.game.winLevel) {
      msg(
        this.game,
        `You win the game by reaching the level ${Settings.game.winLevel}`
      );
    }

    let nextLevel = Levels.find(l => l.levelID === nextLevelNumber)
    if (nextLevel) {
      return nextLevel
    }
    return currentLevel
  }
}
