// eslint-disable-next-line max-classes-per-file
import { Actor, Skills } from '../actor/Actor';
import { Monster } from '../actor/Monster';
import { Game } from '../Game';
import { Quest } from './Quest';

export class AI {
    public game: Game;

    public skills: Skills;

    private quests: Quest[];

    private xp: number;

    private xpLevel: number;

    public attackCountThisTurn = 0;

    public pursuing: Actor | undefined = undefined;

    public constructor(
        public monster: Monster,
        skills: Skills = {},
        quests: Array<Quest> = [],
        xp = 10,
    ) {
        this.game = Game.getInstance();
        this.skills = skills;
        this.quests = quests;
        this.xp = xp;
        this.xpLevel = 0;
        this.pursue(this.game.player);
    }

    public getSkills(): Skills {
        return this.skills;
    }

    public getQuests(): Array<Quest> {
        return this.quests;
    }

    public addQuest(quest: Quest): void {
        this.quests.push(quest);
    }

    public act(): void {
        if (this.monster.stunned) {
            this.monster.stunned = false;
            this.game.ui.msg(
                this.game,
                `${this.monster.name} is no longer stunned`,
            );
            return;
        }
        this.towardPursuedActor();
    }

    public pursue(actor: Actor): void {
        this.pursuing = actor;
    }

    protected towardPursuedActor(): void {
        if (this.pursuing === undefined) {
            return;
        }
        let neighbors = this.monster.getAdjacentTiles();

        neighbors = neighbors.filter((t) => {
            const actors = t.getActorsOnThis();
            return (
                actors.length === 0
                || actors.filter((a) => a.isPlayer).length > 0
            );
        });

        if (neighbors.length > 0) {
            const pursuedActorTile = this.pursuing.getTile();
            neighbors.sort(
                (a, b) => a.distance(pursuedActorTile) - b.distance(pursuedActorTile),
            );
            const newTile = neighbors[0];
            this.monster.tryMove(
                newTile.x - this.monster.tile.x,
                newTile.y - this.monster.tile.y,
            );
        }
    }
}

export class MoveAndAttackAI extends AI {
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
} // When low on hp, monsters of this kind can eat other monsters that are no more
// than half of its size in order do restore hp
export class ConsumerAI extends AI {
    public eat(actor: Monster): boolean {
        actor.life?.die();
        const pointsHealed = this.monster.life.heal((actor.life?.maxHp || 0) / 2);
        this.game.ui.msg(
            this.game,
            `${this.monster.name} heals by ${pointsHealed} by eating ${actor.name}`,
        );
        this.game.animation.shakeAmount = 5;
        return pointsHealed > 0;
    }

    // Make this behaviour possible to attach to other types of actors
    public act(): void {
        super.act();
        if (this.monster.life.hp < this.monster.life.maxHp * 0.75) {
            const smallMonsters = this.game.monsters
                .filter(
                    (t) => t.life !== undefined
                        && t.life.maxHp < this.monster.life.maxHp / 2,
                )
                .sort(
                    (a, b) => a.tile.distance(this.monster.tile)
                        - b.tile.distance(this.monster.tile),
                );
            this.pursue(smallMonsters[0]);
            const neighbors = this.monster.tile
                .getAdjacentActors<Monster>()
                .filter(
                    (t) => t.life !== undefined
                        && t.life.maxHp < this.monster.life.maxHp / 2,
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
