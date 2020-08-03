import { Actor, ActorTemplate } from "./Actor";

export class Player extends Actor {
    constructor(spec: ActorTemplate) {
        super({ ...spec, name: "You", char: "@", sprite: 0 });
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

export class UninitializedPlayer extends Player {

}
