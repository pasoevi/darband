import { Actor, WizardLife } from "./Actor";
import { Tile } from "./Tile";

export class Player extends Actor {
    public constructor(tile: Tile) {
        super("You", tile, 0);
        this.life = new WizardLife(this);
        this.isPlayer = true;
    }

    public tryMove(dx: number, dy: number): boolean {
        if (super.tryMove(dx, dy)) {
            this.game.tick();
            return true;
        }
        return false;
    }
}

export class UninitializedPlayer extends Player {}
