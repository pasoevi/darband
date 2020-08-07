import { Game } from "../Game";
import { GameUI } from "../lib/interfaces";

export class CanvasUI implements GameUI {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public msg(game: Game, text: string, color?: string): void {
        // eslint-disable-next-line no-console
        console.log(text);
        game.renderer.drawText("Level: " + game.levelID, 25, false, 40, "violet");
    }

    public render(game: Game): void {
        game.renderer.drawText("Level: " + game.levelID, 25, false, 40, "violet");
    }
}
