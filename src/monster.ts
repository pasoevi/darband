import { Actor, AI, Life, MoveAndAttackAI, SimpleLife } from "./Actor";
import { Game } from "./Game";
import { Tile } from "./Tile";

export class Monster extends Actor {
    public ai: AI;
    constructor(
        name: string,
        sprite: number,
        tile: Tile,
        domains: Array<number>,
        life?: Life,
        ai?: AI,
    ) {
        super(name, tile, sprite);
        this.life = life ?? new SimpleLife(this);
        this.ai = ai ?? new MoveAndAttackAI();
    }

    public update(): void {
        this.game.ui.msg(
            this.game,
            `${this.name} ${this.stunned ? "is" : "is NOT"} stunned`,
        );
        if (this.stunned) {
            this.stunned = false;
            return;
        }
        this.act();
    }

    public getAdjacentTiles(): Array<Tile> {
        return this.game
            .getTile(this.tile.x, this.tile.y)
            .getAdjacentPassableTiles();
    }

    protected act(): void {
        let neighbors = this.getAdjacentTiles();

        neighbors = neighbors.filter((t) => {
            const actors = t.getActorsOnThis();
            return (
                actors.length === 0 ||
                actors.filter((a) => a.isPlayer).length > 0
            );
        });

        if (neighbors.length > 0) {
            const playerTile = this.game.player?.getTile();
            neighbors.sort(
                (a, b) => a.distance(playerTile) - b.distance(playerTile),
            );
            const newTile = neighbors[0];
            this.tryMove(
                newTile.x - this.getTile().x,
                newTile.y - this.getTile().y,
            );
        }
    }
}

export class Goblin extends Monster {
    constructor(tile: Tile) {
        super("goblin", 12, tile, [0, 1, 2]);
    }
}

export class Kobold extends Monster {
    constructor(tile: Tile) {
        super("kobold", 15, tile, [0, 1, 2]);
    }
}

export class Orc extends Monster {
    constructor(tile: Tile) {
        super("orc", 14, tile, [0, 1, 2, 3]);
    }
}

export class Dwarf extends Monster {
    constructor(tile: Tile) {
        super("dwarf", 19, tile, [7, 8, 9, 10, 11, 12]);
    }
}

export class Man extends Monster {
    constructor(tile: Tile) {
        super("man", 16, tile, [3, 4, 5]);
    }
}

export class Troll extends Monster {
    constructor(tile: Tile) {
        super("troll", 17, tile, [3, 4]);
    }

    update(): void {
        const startedStunned = this.stunned;
        super.update();
        if (!startedStunned) {
            this.stunned = true;
        }
    }
}

export class Elf extends Monster {
    constructor(tile: Tile) {
        super("elf", 18, tile, [0, 1, 2]);
    }
}

export class Dragon extends Monster {
    constructor(tile: Tile) {
        super("dragon", 3, tile, [10, 11, 12, 13, 14, 15]);
    }
}

export class Snake extends Monster {
    constructor(tile: Tile) {
        super("snake", 13, tile, [7, 8, 9]);
    }

    act(): void {
        this.ai.attackCountThisTurn = 0;
        super.act();

        if (this.ai.attackCountThisTurn === 0) {
            super.act();
        }
    }
}

export function createMonster<M extends Monster>(C: new (tile: Tile) => M): M {
    const randomTile = Game.getInstance().getRandomPassableTile();
    return new C(randomTile);
}
