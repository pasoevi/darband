import { Actor, AI, Life, MoveAndAttackAI, SimpleLife } from "./Actor";
import { Game } from "./Game";
import { Tile } from "./Tile";

export class Monster extends Actor {
    public ai: AI;
    public life: Life;
    pursuing: Actor | undefined = undefined;
    constructor(
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
        this.ai = ai ?? new MoveAndAttackAI();
        this.pursue(this.game.player);
    }

    public update(): void {
        this.game.ui.msg(
            this.game,
            `${this.name} ${this.stunned ? "is" : "is NOT"} stunned`,
        );

        this.act();
    }

    public getAdjacentTiles(): Array<Tile> {
        return this.game
            .getTile(this.tile.x, this.tile.y)
            .getAdjacentPassableTiles();
    }

    protected act(): void {
        if (this.stunned) {
            this.stunned = false;
            this.game.ui.msg(this.game, `${this.name} is no longer stunned`);
            return;
        }
        this.towardPursuedActor();
    }

    pursue(actor: Actor): void {
        this.pursuing = actor;
    }

    protected towardPursuedActor(): void {
        if (this.pursuing === undefined) {
            return;
        }
        let neighbors = this.getAdjacentTiles();

        neighbors = neighbors.filter((t) => {
            const actors = t.getActorsOnThis();
            return (
                actors.length === 0 ||
                actors.filter((a) => a.isPlayer).length > 0
            );
        });

        if (neighbors.length > 0) {
            const pursuedActor = this.pursuing.getTile();
            neighbors.sort(
                (a, b) => a.distance(pursuedActor) - b.distance(pursuedActor),
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
        super("goblin", 12, tile, [0, 1, 2], 95);
    }
}

export class Kobold extends Monster {
    constructor(tile: Tile) {
        super("kobold", 15, tile, [0, 1, 2], 125);
    }
}

export class Orc extends Monster {
    constructor(tile: Tile) {
        super("orc", 14, tile, [0, 1, 2, 3], 115);
    }
}

export class Dwarf extends Monster {
    constructor(tile: Tile) {
        super("dwarf", 19, tile, [7, 8, 9, 10, 11, 12], 120);
    }
}

export class Man extends Monster {
    constructor(tile: Tile) {
        super("man", 16, tile, [3, 4, 5], 100);
    }
}

export class Troll extends Monster {
    constructor(tile: Tile) {
        super("troll", 17, tile, [3, 4], 160);
    }

    update(): void {
        const startedStunned = this.stunned;
        super.update();
        if (!startedStunned) {
            this.stunned = true;
            this.game.ui.msg(this.game, `${this.name} is stunned`);
        }
    }
}

export class Elf extends Monster {
    constructor(tile: Tile) {
        super("elf", 18, tile, [0, 1, 2], 150);
    }
}

export class Dragon extends Monster {
    constructor(tile: Tile) {
        super("dragon", 3, tile, [10, 11, 12, 13, 14, 15], 250);
    }

    // When low on hp, monsters of this kind can eat other monsters that are no more
    // than half of its size in orter do restore hp
    eat(actor: Monster): boolean {
        this.game.ui.msg(this.game, `${this.name} eats ${actor.name}`);
        actor.life?.die();
        const pointsHealed = this.life.heal(actor.life?.maxHp / 2);
        return pointsHealed > 0;
    }

    // Make this behaviour possible to attach to other types of actors
    act(): void {
        super.act();
        if (this.life.hp < this.life.maxHp * 0.75) {
            const smallMonsters = this.game.monsters
                .filter(
                    (t) =>
                        t.life !== undefined &&
                        t.life.maxHp < this.life.maxHp / 2,
                )
                .sort(
                    (a, b) =>
                        a.tile.distance(this.tile) - b.tile.distance(this.tile),
                );
            this.pursue(smallMonsters[0]);
            const neighbors = this.tile
                .getAdjacentActors<Monster>()
                .filter(
                    (t) =>
                        t.life !== undefined &&
                        t.life.maxHp < this.life.maxHp / 2,
                );
            if (neighbors.length > 0) {
                this.eat(neighbors[0]);
            }
        } else {
            this.pursue(this.game.player);
        }
    }
}

export class Snake extends Monster {
    constructor(tile: Tile) {
        super("snake", 13, tile, [7, 8, 9], 15);
    }

    act(): void {
        this.ai.attackCountThisTurn = 0;
        super.act();

        if (this.ai.attackCountThisTurn === 0) {
            super.act();
        }
    }
}

export function createMonster<M extends Monster>(
    actorClass: new (tile: Tile) => M,
): M {
    const randomTile = Game.getInstance().getRandomPassableTile();
    return new actorClass(randomTile);
}
