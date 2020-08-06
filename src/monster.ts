import { Actor, AI, Life } from "./Actor";
import { Game } from "./Game";
import { Tile } from "./Tile";

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

    public update(): void {
        this.game.ui.msg(
            this.game,
            `${this.name} ${this.stunned ? "is" : "is NOT"} stunned`,
        );

        this.ai.act();
    }
}

export class Goblin extends Monster {
    public constructor(tile: Tile) {
        super("goblin", 12, tile, [0, 1, 2], 95);
    }
}

export class Kobold extends Monster {
    public constructor(tile: Tile) {
        super("kobold", 15, tile, [0, 1, 2], 125);
    }
}

export class Orc extends Monster {
    public constructor(tile: Tile) {
        super("orc", 14, tile, [0, 1, 2, 3], 115);
    }
}

export class Wolf extends Monster {
    public constructor(tile: Tile) {
        super("wolf", 11, tile, [0, 1, 2, 3, 4], 95);
        this.ai = new ConfusedAI(this);
    }
}

export class Dwarf extends Monster {
    public constructor(tile: Tile) {
        super("dwarf", 19, tile, [7, 8, 9, 10, 11, 12], 120);
    }
}

export class Man extends Monster {
    public constructor(tile: Tile) {
        super("man", 16, tile, [3, 4, 5], 100);
    }
}

export class Troll extends Monster {
    public constructor(tile: Tile) {
        super("troll", 17, tile, [3, 4], 160);
        this.ai = new SlowAI(this);
    }
}

export class Elf extends Monster {
    public constructor(tile: Tile) {
        super("elf", 18, tile, [0, 1, 2], 150);
    }
}

export class Dragon extends Monster {
    public constructor(tile: Tile) {
        super("dragon", 3, tile, [10, 11, 12, 13, 14, 15], 250, undefined);
        this.ai = new ConsumerAI(this);
    }
}

export class Snake extends Monster {
    public constructor(tile: Tile) {
        super("snake", 13, tile, [7, 8, 9], 15);
    }
}

export function createMonster<M extends Monster>(
    actorClass: new (tile: Tile) => M,
): M {
    const randomTile = Game.getInstance().getRandomPassableTile();
    return new actorClass(randomTile);
}

export class SimpleLife extends Life {
    public constructor(actor: Actor, maxHP = 100) {
        super(maxHP, maxHP, 2, actor);
    }
}

export class MoveAndAttackAI extends AI {
    public constructor(actor: Monster) {
        super(actor);
    }

    public act(): void {
        this.attackCountThisTurn = 0;
        super.act();

        if (this.attackCountThisTurn === 0) {
            super.act();
        }
    }
}

export class SlowAI extends AI {
    public constructor(monster: Monster, public speed = 5) {
        super(monster);
    }

    public act(): void {
        const startedStunned = this.monster.stunned;
        super.act();
        if (!startedStunned) {
            this.monster.stunned = true;
            this.game.ui.msg(this.game, `${this.monster.name} is stunned`);
        }
    }
}

// When low on hp, monsters of this kind can eat other monsters that are no more
// than half of its size in orter do restore hp
export class ConsumerAI extends AI {
    public constructor(actor: Monster) {
        super(actor);
    }

    public eat(actor: Monster): boolean {
        actor.life?.die();
        const pointsHealed = this.monster.life.heal(actor.life?.maxHp / 2);
        this.game.ui.msg(
            this.game,
            `${this.monster.name} heals by ${pointsHealed} by eating ${actor.name}`,
        );
        return pointsHealed > 0;
    }

    // Make this behaviour possible to attach to other types of actors
    public act(): void {
        super.act();
        if (this.monster.life.hp < this.monster.life.maxHp * 0.75) {
            const smallMonsters = this.game.monsters
                .filter(
                    (t) =>
                        t.life !== undefined &&
                        t.life.maxHp < this.monster.life.maxHp / 2,
                )
                .sort(
                    (a, b) =>
                        a.tile.distance(this.monster.tile) -
                        b.tile.distance(this.monster.tile),
                );
            this.pursue(smallMonsters[0]);
            const neighbors = this.monster.tile
                .getAdjacentActors<Monster>()
                .filter(
                    (t) =>
                        t.life !== undefined &&
                        t.life.maxHp < this.monster.life.maxHp / 2,
                );
            if (neighbors.length > 0) {
                this.eat(neighbors[0]);
            }
        } else {
            this.pursue(this.game.player);
        }
    }
}

export class ConfusedAI extends AI {
    public act(): void {
        const neighbors = this.monster.tile.getAdjacentPassableTiles();
        if (neighbors.length > 0) {
            const dx = neighbors[0].x - this.monster.tile.x;
            const dy = neighbors[0].y - this.monster.tile.y;
            this.monster.tryMove(dx, dy);
        }
    }
}
