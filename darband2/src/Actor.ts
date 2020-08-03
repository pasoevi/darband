import { Game } from "./Game";
import { Modifier, Weapon } from "./Weapon";
import { Colors } from "./Data";
import { Tile } from "./Tile";
import { Item } from "./Item";

export class Life {
    private game: Game;
    hp: number;
    maxHp: number;
    defence: number;
    private corpseName: string;
    private actor: Actor;

    constructor(spec: LifeTemplate, actor: Actor) {
        this.game = Game.getInstance();
        this.hp = spec.hp;
        this.maxHp = spec.maxHp;
        this.defence = spec.defence;
        this.corpseName = spec.corpseName;
        this.actor = actor;
    }

    public die(): void {
        this.hp = 0;
        this.game.ui.msg(this.game, `${this.actor.getName()} dies`);
        // this.game.scheduler.remove(this.actor);
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

class AI {
    private skills: Skill[];
    private quests: Quest[];
    private xp: number;
    private xpLevel: number;

    constructor() {
        this.skills = [];
        this.quests = [];
        this.xp = 0;
        this.xpLevel = 0;
    }

    public getSkills() {
        return this.skills;
    }

    public getQuests() {
        return this.quests;
    }

    public addQuest(quest: Quest) {
        this.quests.push(quest);
    }

    public getXP() {
        return this.xp;
    }

    public getXpLevel() {
        return this.xpLevel;
    }
}

export class Actor {
    name: string;
    sprite?: number;
    x: number;
    y: number;
    isPlayer = false;
    game: Game;
    public life?: Life;
    public inventory?: Inventory;
    public ai?: AI;

    constructor(spec: ActorTemplate) {
        this.game = Game.getInstance();
        this.name = name;
        this.sprite = spec.sprite;

        const lifeTemplate = spec.lifeTemplate;

        if (lifeTemplate) {
            this.life = new Life(lifeTemplate, this);
        }

        if (spec.aiTemplate) {
            this.ai = new AI();
        }

        // randomTile will be used only if the spec doesn't contain coordinates
        const randomTile = Game.getInstance().getRandomPassableTile();
        this.x = spec.x ?? randomTile.x;
        this.y = spec.y ?? randomTile.y;
    }

    getName(): string {
        return this.name;
    }

    public getTile(): Tile {
        return this.game.tiles[this.x][this.y];
    }

    draw(): void {
        if (this.sprite !== undefined) {
            this.game.renderer.drawSprite(this.sprite, this.x, this.y);
        }
        if (this.life !== undefined) {
            this.drawHP();
        }
    }

    drawHP(): void {
        const tileSize = this.game.renderer.options.tileSize;
        console.log(this.life);

        console.log(`hp: ${this.life?.hp}, maxHp: ${this.life?.maxHp}`);
        const hpPercentage = Math.floor(
            (this.life?.hp ?? 0) / (this.life?.maxHp ?? 1),
        );
        const greenLength = tileSize * hpPercentage;
        const redLength = tileSize - greenLength;
        this.game.renderer.drawRect(
            "green",
            this.x * tileSize,
            this.y * tileSize + tileSize - 3,
            greenLength,
            3,
        );
        this.game.renderer.drawRect(
            "red",
            this.x + greenLength,
            this.y * tileSize + tileSize - 3,
            redLength,
            3,
        );
    }

    tryMove(dx: number, dy: number): boolean {
        const newTile = this.getTile()?.getNeighbor(dx, dy);
        if (newTile?.passable) {
            if (newTile?.getActorsOnThis().length === 0) {
                this.move(newTile);
            }
            return true;
        }
        return false;
    }

    move(newTile: Tile): void {
        this.x = newTile.x;
        this.y = newTile.y;
    }
}

export interface Race {
    name: string;
    domains: Array<number>;
}

export interface ActorTemplate {
    x?: number;
    y?: number;
    speed?: number;
    name?: string;
    col?: string;
    sprite?: number; // TODO: Make a type that lists every possible visible character
    char?: string;
    lifeTemplate?: LifeTemplate;
    itemTemplate?: ItemTemplate;
    aiTemplate?: ItemTemplate;
    race?: Race;
}
export interface LifeTemplate {
    hp: number;
    maxHp: number;
    defence: number;
    corpseName: string;
}

export interface ItemTemplate extends ActorTemplate {
    power: number;
}

export interface AITemplate {
    x: number;
    y: number;
    name: string;
}
