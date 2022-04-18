import { Colors } from '../Data';
import { Game } from '../Game';
import { Modifier, Weapon } from '../Weapon';
import { Actor } from './Actor';

export class Life {
    public hp: number;

    public maxHp: number;

    public defence: number;

    private readonly game: Game;

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
        if (this.actor.isPlayer) {
            this.game.ui.msg(this.game, 'You die.');
        } else {
            this.game.ui.msg(this.game, `${this.actor.getName()} dies`);
        }
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
        modifiers?: Modifier[],
        weapon?: Weapon,
    ): number {
        let damageTaken = value;

        if (!dealer || !this.isAlive()) {
            return damageTaken;
        }

        if (weapon) {
            damageTaken = weapon.power - this.defence;
        }

        if (modifiers !== undefined) {
            damageTaken = modifiers.reduce(
                (prev, current) => prev + current.value,
                damageTaken,
            );
        }

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
