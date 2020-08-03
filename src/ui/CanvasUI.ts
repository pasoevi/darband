import { GameUI } from "../lib/interfaces";
import { Game } from "../Game";

export class CanvasUI implements GameUI {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public msg(game: Game, text: string, color?: string): void {
        /* Noop */
    }
}
