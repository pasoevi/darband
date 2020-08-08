import { Colors } from "./Data";
import { Game } from "./Game";
import { Item } from "./Item";
import { Animation } from "./lib/interfaces";
import { Monster } from "./Monster";
import { Tile } from "./Tile";
import { Modifier, Weapon } from "./Weapon";

export class Life {
    public hp: number;
    public maxHp: number;
    public defence: number;
    private game: Game;
    private actor: Actor;

    public constructor(
        hp: number,
        maxHp: number,
        defence: number,
        actor: Actor,
    ) {
        this.game = Game.getInstance();
        this.hp = hp;
        this.maxHp = maxHp;
        this.defence = defence;
        this.actor = actor;
    }

    public die(): void {
        this.hp = 0;
        this.actor.getTile().monster = null;
        this.game.ui.msg(this.game, `${this.actor.getName()} dies`);
    }

    public isAlive(): boolean {
        return this.hp > 0;
    }

    /**
     * Take value damage from dealer, i.e subtract value from the dealer.
     */
    public takeDamage(
        dealer: Actor,
        value: number,
        modifiers: Modifier[],
        weapon?: Weapon,
    ): number {
        let damageTaken = value;

        if (!dealer || !this.isAlive()) {
            return damageTaken;
        }

        if (weapon) {
            damageTaken = weapon.power - this.defence;
        }

        damageTaken = modifiers.reduce(
            (prev, current) => prev + current.value,
            damageTaken,
        );

        const hpBeforeAttack = this.hp;
        this.hp = Math.max(0, this.hp - damageTaken);
        if (this.hp <= 0) {
            this.die();
        }

        this.game.ui.msg(
            this.game,
            `${dealer.getName()} attacks ${this.actor.getName()} for ${damageTaken}. Was ${hpBeforeAttack} is ${
                this.hp
            }`,
            Colors.red,
        );

        return damageTaken;
    }

    public heal(hp: number): number {
        this.hp = Math.min(this.maxHp, this.hp + hp);
        this.game.ui.msg(this.game, `${this.actor.name} heals by ${hp}`);
        return hp;
    }
}

export class Inventory {
    private game: Game;
    private weapon?: Weapon;
    private items: Item[];

    public constructor() {
        this.game = Game.getInstance();
        this.items = [];
    }

    public getCurrentWeapon(): Weapon | undefined {
        return this.weapon;
    }

    public pickItem(item: Item): void {
        this.items.push(item);
    }
}

class Quest {
    public getName() {
        return "Some quest";
    }
}

interface Skill {
    value: number;
    name: string;
}

export type Skills = { [key: string]: number };

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
                actors.length === 0 ||
                actors.filter((a) => a.isPlayer).length > 0
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

export class Actor {
    public name: string;
    public sprite?: number;
    public tile: Tile;
    public isPlayer = false;
    public game: Game;
    public life?: Life;
    public inventory?: Inventory;
    public ai?: AI;
    public domains?: ReadonlyArray<number>;
    public stunned = false;
    private animation: Animation;

    public constructor(
        name: string,
        tile: Tile,
        sprite: number,
        life?: Life,
        ai?: AI,
        domains?: ReadonlyArray<number>,
    ) {
        this.game = Game.getInstance();
        this.tile = tile;
        this.name = name ?? "Unnamed monster";
        this.sprite = sprite;
        this.domains = domains;
        this.animation = {
            offsetX: 0,
            offsetY: 0,
            shakeAmount: 0,
            shakeX: 0,
            shakeY: 0,
        };

        if (life !== undefined) {
            this.life = life;
        }

        if (ai !== undefined) {
            this.ai = ai;
        }
    }

    public getName(): string {
        return this.name;
    }

    public getTile(): Tile {
        return this.tile;
    }

    public getDisplayX(): number {
        return this.tile.x + this.animation.offsetX;
    }

    public getDisplayY(): number {
        return this.tile.y + this.animation.offsetY;
    }

    public draw(): void {
        if (this.sprite !== undefined) {
            this.game.renderer.drawSprite(
                this.sprite,
                this.getDisplayX(),
                this.getDisplayY(),
                this.game.animation,
            );
        }
        if (this.life !== undefined) {
            this.drawHP();
        }

        this.animation.offsetX -= Math.sign(this.animation.offsetX) * (1 / 8);
        this.animation.offsetY -= Math.sign(this.animation.offsetY) * (1 / 8);
    }

    public drawHP(): void {
        const tileSize = this.game.renderer.options.tileSize;
        const hpPercentage = (this.life?.hp ?? 0) / (this.life?.maxHp ?? 1);
        const greenLength = tileSize * hpPercentage;
        const redLength = tileSize - greenLength;
        const hpLineHeight = 2;
        this.game.renderer.drawRect(
            "lime",
            this.getDisplayX() * tileSize,
            this.getDisplayY() * tileSize + tileSize - hpLineHeight,
            greenLength,
            hpLineHeight,
        );
        this.game.renderer.drawRect(
            "red",
            this.getDisplayX() * tileSize + greenLength,
            this.getDisplayY() * tileSize + tileSize - hpLineHeight,
            redLength,
            hpLineHeight,
        );
    }

    public tryMove(dx: number, dy: number): boolean {
        const newTile = this.tile.getNeighbor(dx, dy);
        if (newTile.passable) {
            if (newTile.monster === null) {
                this.move(newTile);
            } else if (this.isPlayer !== newTile.monster.isPlayer) {
                if (this.ai !== undefined) {
                    this.ai.attackCountThisTurn++;
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
            `${this.name} ${this.isPlayer ? "move" : "moves"} to ${
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

    public getAdjacentTiles(): Array<Tile> {
        return this.game
            .getTile(this.tile.x, this.tile.y)
            .getAdjacentPassableTiles();
    }
}

export class WizardLife extends Life {
    public constructor(actor: Actor, maxHP = 200) {
        super(maxHP, maxHP, 3, actor);
    }
}
