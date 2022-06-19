// eslint-disable-next-line max-classes-per-file
import { AI, ConfusedAI } from '../ai/AI';
import { Game } from '../Game';
import { Item } from '../Item';
import { Animation, PosOnMap } from '../lib/Interfaces';
import { Tile } from '../Tile';
import { Weapon } from '../Weapon';
import { Life } from './Life';
import { Monster } from './Monster';

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

interface Skill {
    value: number;
    name: string;
}

export type Skills = { [key: string]: number };

export class Effect {
    // eslint-disable-next-line no-useless-constructor
    public constructor(
        // eslint-disable-next-line no-use-before-define
        public actor: Actor,
        public turnsLeft = 5,
        public name: string = '',
        public onExpired?: () => void,
    ) {}

    private renderOnMap() {
        /* noop */
    }

    private renderOnUI() {
        /* noop */
    }

    public update(): void {
        this.turnsLeft -= 1;
        if (this.turnsLeft <= 0 && this.onExpired !== undefined) {
            this.onExpired();
        }
    }
}

export class ConfusionEffect extends Effect {
    private oldAI: AI;

    public constructor(monster: Monster) {
        super(monster, 5);
        this.oldAI = monster.ai;
        this.onExpired = () => {
            monster.ai = this.oldAI;
            monster.game.ui.msg(
                monster.game,
                `${monster.name} is no longer confused`,
            );
        };
        monster.ai = new ConfusedAI(
            monster,
            this.oldAI.skills,
            this.oldAI.getQuests(),
        );

        monster.game.ui.msg(monster.game, `${monster.name} is now confused`);
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

    protected animation: Animation;

    public effects: Array<Effect>;

    public lastMove: PosOnMap;

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
        this.name = name ?? 'Unnamed monster';
        this.sprite = sprite;
        this.domains = domains;
        this.lastMove = { x: -1, y: 0 };
        this.effects = [];

        this.animation = {
            offsetX: 0,
            offsetY: 0,
            effectCounter: 0,
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

    public addEffect(EffectClass: typeof Effect): void {
        const effect = new EffectClass(this);
        this.effects.push(effect);
    }

    public getDisplayX(): number {
        return this.tile.x + this.animation.offsetX;
    }

    public getDisplayY(): number {
        return this.tile.y + this.animation.offsetY;
    }

    public update(): void {
        this.game.ui.msg(
            this.game,
            `${this.name} ${this.stunned ? 'is' : 'is NOT'} stunned`,
        );

        if (this.ai) {
            this.ai.act();
        }

        for (let i = this.effects.length - 1; i >= 0; i--) {
            const effect = this.effects[i];
            effect.update();
            if (effect.turnsLeft <= 0) {
                if (effect.onExpired !== undefined) {
                    this.effects.splice(i, 1);
                }
            }
        }
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

        this.animation.offsetX -= Math.sign(this.animation.offsetX) * (1 / 8);
        this.animation.offsetY -= Math.sign(this.animation.offsetY) * (1 / 8);
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
