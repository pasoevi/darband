import { Actor } from "./Actor";

export class Player extends Actor {
    public tryMove(dx: number, dy: number): boolean {
        if (super.tryMove(dx, dy)) {
            this.game.tick();
            return true;
        }
        return false;
    }
}
