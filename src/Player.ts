import { Life, WizardLife } from "./Actor";
import { Monster } from "./Monster";
import { Tile } from "./Tile";

export class Player extends Monster {
    public life: Life;
    public constructor(tile: Tile) {
        super("You", 0, tile, []);
        this.life = new WizardLife(this, 1000);
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
