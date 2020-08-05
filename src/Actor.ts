import { Modifier, Weapon } from "./Weapon";
import { Colors } from "./Data";
import { Game } from "./Game";
import { Item } from "./Item";
import { Tile } from "./Tile";

export class Life {
    private game: Game;
    hp: number;
    maxHp: number;
    defence: number;
    private actor: Actor;

    constructor(hp: number, maxHp: number, defence: number, actor: Actor) {
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

        this.game.ui.msg(
            this.game,
            `${this.hp} was and now is ${damageTaken} less`,
        );
        this.game.ui.msg(
            this.game,
            `${dealer.getName()} attacks ${this.actor.getName()} for ${damageTaken} hp`,
            Colors.red,
        );

        if (this.hp - damageTaken > 0) {
            this.hp -= damageTaken;
        } else {
            this.die();
        }

        return damageTaken;
    }
}

export class Inventory {
    private game: Game;
    private weapon?: Weapon;
    private items: Item[];

    constructor() {
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
    public skills: Skills;
    private quests: Quest[];
    private xp: number;
    private xpLevel: number;

    constructor(skills: Skills, quests: Array<Quest>, xp: number) {
        this.skills = skills;
        this.quests = quests;
        this.xp = xp;
        this.xpLevel = 0;
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

    public getXP(): number {
        return this.xp;
    }

    public getXpLevel(): number {
        return this.xpLevel;
    }
}

export class Actor {
    name: string;
    sprite?: number;
    tile: Tile;
    isPlayer = false;
    game: Game;
    public life?: Life;
    public inventory?: Inventory;
    public ai?: AI;
    public domains?: ReadonlyArray<number>;

    constructor(
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

        if (life !== undefined) {
            this.life = life;
        }

        if (ai !== undefined) {
            this.ai = ai;
        }
    }

    getName(): string {
        return this.name;
    }

    public getTile(): Tile {
        return this.tile;
    }

    draw(): void {
        if (this.sprite !== undefined) {
            this.game.renderer.drawSprite(
                this.sprite,
                this.tile.x,
                this.tile.y,
            );
        }
        if (this.life !== undefined) {
            this.drawHP();
        }
    }

    drawHP(): void {
        const tileSize = this.game.renderer.options.tileSize;
        const hpPercentage = (this.life?.hp ?? 0) / (this.life?.maxHp ?? 1);
        const greenLength = tileSize * hpPercentage;
        const redLength = tileSize - greenLength;
        const hpLineHeight = 2;
        this.game.renderer.drawRect(
            "lime",
            this.tile.x * tileSize,
            this.tile.y * tileSize + tileSize - hpLineHeight,
            greenLength,
            hpLineHeight,
        );
        this.game.renderer.drawRect(
            "red",
            this.tile.x * tileSize + greenLength,
            this.tile.y * tileSize + tileSize - hpLineHeight,
            redLength,
            hpLineHeight,
        );
    }

    tryMove(dx: number, dy: number): boolean {
        const newTile = this.tile.getNeighbor(dx, dy);
        if (newTile.passable) {
            if (newTile.monster === null) {
                this.move(newTile);
            } else if (this.isPlayer !== newTile.monster.isPlayer) {
                newTile.monster.life?.takeDamage(this, 10, []);
            }
            return true;
        }
        return false;
    }

    move(newTile: Tile): void {
        const currentTile = this.getTile();
        currentTile.monster = null;

        this.tile.x = newTile.x;
        this.tile.y = newTile.y;
        newTile.monster = this;
    }
}

export class WizardLife extends Life {
    constructor(actor: Actor) {
        super(190, 190, 3, actor);
    }
}

export class SimpleLife extends Life {
    constructor(actor: Actor) {
        super(110, 110, 2, actor);
    }
}

export class MoveAndAttackAI extends AI {
    constructor() {
        super({}, [], 10);
    }
}
