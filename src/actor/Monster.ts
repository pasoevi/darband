// eslint-disable-next-line max-classes-per-file
import {
    AI, ConfusedAI, ConsumerAI, MoveAndAttackAI, SlowAI,
} from '../ai/AI';
import { Game } from '../Game';
import { Tile } from '../Tile';
import { Actor } from './Actor';
import { Life } from './Life';

export class SimpleLife extends Life {
    public constructor(actor: Actor, maxHP = 100) {
        super(maxHP, maxHP, 2, actor);
    }
}

export class Monster extends Actor {
    public ai: AI;

    public life: Life;

    public constructor(
        name: string,
        sprite: number,
        tile: Tile,
        domains: Array<number>,
        maxHP = 100,
        life?: Life,
        ai?: AI,
    ) {
        super(name, tile, sprite);
        this.life = life ?? new SimpleLife(this, maxHP);
        this.ai = ai ?? new MoveAndAttackAI(this);
    }

    public draw(): void {
        super.draw();
        this.drawHP();
    }

    public drawHP(): void {
        const { tileSize } = this.game.renderer.options;
        const hpPercentage = (this.life?.hp ?? 0) / (this.life?.maxHp ?? 1);
        const greenLength = tileSize * hpPercentage;
        const redLength = tileSize - greenLength;
        const hpLineHeight = 2;
        this.game.renderer.drawRect(
            'lime',
            this.getDisplayX() * tileSize,
            this.getDisplayY() * tileSize + tileSize - hpLineHeight,
            greenLength,
            hpLineHeight,
        );
        this.game.renderer.drawRect(
            'red',
            this.getDisplayX() * tileSize + greenLength,
            this.getDisplayY() * tileSize + tileSize - hpLineHeight,
            redLength,
            hpLineHeight,
        );
    }

    public tryMove(dx: number, dy: number): boolean {
        const newTile = this.tile.getNeighbor(dx, dy);
        if (newTile.passable) {
            this.lastMove = { x: dx, y: dy };
            if (newTile.monster === null) {
                this.move(newTile);
            } else if (this.isPlayer !== newTile.monster.isPlayer) {
                if (this.ai !== undefined) {
                    this.ai.attackCountThisTurn += 1;
                }
                newTile.monster.stunned = true;
                this.game.ui.msg(
                    this.game,
                    `${this.name} stuns ${newTile.monster.name}`,
                );
                // TODO: Get actual damage value from the dealer taking into account
                // stats, defence, etc.
                const power = 10;

                newTile.monster.life?.takeDamage(this, power, []);

                this.animation.offsetX = (newTile.x - this.tile.x) / 2;
                this.animation.offsetY = (newTile.y - this.tile.y) / 2;
            }
            return true;
        }
        return false;
    }

    public move(newTile: Tile): void {
        this.game.ui.msg(
            this.game,
            `${this.name} ${this.isPlayer ? 'move' : 'moves'} to ${
                newTile.x
            }, ${newTile.y}`,
        );
        const currentTile = this.getTile();
        currentTile.monster = null;
        this.animation.offsetX = currentTile.x - newTile.x;
        this.animation.offsetY = currentTile.y - newTile.y;

        this.tile = newTile;
        newTile.monster = this;
    }
}

export class Goblin extends Monster {
    public constructor(tile: Tile) {
        super('goblin', 12, tile, [0, 1, 2], 95);
    }
}

export class Kobold extends Monster {
    public constructor(tile: Tile) {
        super('kobold', 15, tile, [0, 1, 2], 125);
    }
}

export class Orc extends Monster {
    public constructor(tile: Tile) {
        super('orc', 14, tile, [0, 1, 2, 3], 115);
    }
}

export class Wolf extends Monster {
    public constructor(tile: Tile) {
        super('wolf', 11, tile, [0, 1, 2, 3, 4], 95);
        this.ai = new ConfusedAI(this);
    }
}

export class Dwarf extends Monster {
    public constructor(tile: Tile) {
        super('dwarf', 19, tile, [7, 8, 9, 10, 11, 12], 120);
    }
}

export class Man extends Monster {
    public constructor(tile: Tile) {
        super('man', 16, tile, [3, 4, 5], 100);
    }
}

export class Troll extends Monster {
    public constructor(tile: Tile) {
        super('troll', 17, tile, [3, 4], 160);
        this.ai = new SlowAI(this);
    }
}

export class Elf extends Monster {
    public constructor(tile: Tile) {
        super('elf', 18, tile, [0, 1, 2], 150);
    }
}

export class Dragon extends Monster {
    public constructor(tile: Tile) {
        super('dragon', 3, tile, [10, 11, 12, 13, 14, 15], 250, undefined);
        this.ai = new ConsumerAI(this);
    }
}

export class Snake extends Monster {
    public constructor(tile: Tile) {
        super('snake', 13, tile, [7, 8, 9], 15);
    }
}

export function createMonster<M extends Monster>(
    ActorClass: new (tile: Tile) => M,
): M {
    const randomTile = Game.getInstance().getRandomPassableTile();
    return new ActorClass(randomTile);
}
