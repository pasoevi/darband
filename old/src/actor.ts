import { dbg, msg } from "./message";
import { Colors } from "./datafiles";
import { Game } from "./game";
import { Weapon, Modifier } from "./weapon";
import { Item } from "./item";
import { MapPosition } from "./map";

export class Inventory {
    game: Game;
    weapon?: Weapon;
    items: Item[];

    constructor() {
        this.game = Game.getSingleton();
        this.items = [];
    }

    public getCurrentWeapon() {
        return this.weapon;
    }

    public pickItem(item: Item) {
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

export class Life {
    private game: Game;
    private hp: number;
    private maxHp: number;
    private defence: number;
    private corpseName: string;
    private actor: Actor;

    constructor(spec: LifeTemplate, actor: Actor) {
        this.game = Game.getSingleton();
        this.hp = spec.hp;
        this.maxHp = spec.maxHp;
        this.defence = spec.defence;
        this.corpseName = spec.corpseName;
        this.actor = actor;
    }

    public die() {
        this.hp = 0;
        msg(this.game, `${this.actor.getName()} dies`);
        this.game.scheduler.remove(this.actor);
    }

    public isAlive() {
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
    ) {
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

        msg(this.game, `${this.hp} was and now is ${damageTaken} less`);
        msg(
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

/**
 * Any object that can be located on the map, that has position, and
 * can be drawn.
 *
 * Examples: monsters, items you can pick (potions, weapons, etc.)
 * other items on the map - staircases, fountains, altars, etc.
 *
 * Player and all monsters inherit from this prototype.
 * @param spec
 * @constructor
 */
export class Actor {
    public isPlayer = false;
    protected game: Game;
    private position: MapPosition;
    private name: string;
    private col: string;
    private ch: string;

    public life?: Life;
    public inventory?: Inventory;
    public ai?: AI;

    constructor(spec: ActorTemplate) {
        this.game = Game.getSingleton();
        if (spec.x && spec.y) {
            this.position = {
                x: spec.x,
                y: spec.y,
            };
        } else {
            this.position = {
                x: -1,
                y: -1,
            };
        }

        this.name = spec.name ? spec.name : "";
        this.col = spec.col ? spec.col : Colors.red;
        this.ch = spec.ch ? spec.ch : "?";

        const lifeTemplate = spec.lifeTemplate;

        if (lifeTemplate) {
            this.life = new Life(lifeTemplate, this);
        }

        if (spec.aiTemplate) {
            this.ai = new AI();
        }
    }

    public getInventory() {
        return this.inventory;
    }

    public getName() {
        return this.name;
    }

    public getColor() {
        return this.col;
    }

    public getChar() {
        return this.ch;
    }

    public getPos() {
        return this.position;
    }

    public setPos(pos: MapPosition) {
        if (!this.game.getLevel().map.isPosOnMap(pos)) {
            dbg("Not on map");
            return;
        }

        this.position = pos;
        // this.game.getLevel().map.computeFov(pos);
    }

    public draw() {
        if (!this.position) {
            return;
        }

        if (this.life !== undefined && this.life.isAlive()) {
            this.game.display.draw(
                this.position.x,
                this.position.y,
                this.ch,
                this.col,
                Colors.black,
            );
        } else {
            this.game.display.draw(
                this.position.x,
                this.position.y,
                this.ch,
                Colors.gold_yellow,
                Colors.black,
            );
        }
    }
}

export interface ActorTemplate {
    x?: number;
    y?: number;
    speed?: number;
    name?: string;
    col?: string;
    ch?: string; // TODO: Make a type that lists every possible visible character
    lifeTemplate?: LifeTemplate;
    itemTemplate?: ItemTemplate;
    aiTemplate?: ItemTemplate;
    race: any;
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
